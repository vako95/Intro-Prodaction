import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { WishlistApi } from "../api/modules/wishlist";
import { AuthService } from "../services/auth";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [wishlistMap, setWishlistMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAuthenticated = AuthService.isAuthenticated();

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            setWishlistMap({});
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await WishlistApi.getAll();
            setWishlist(data);
            
            const map = {};
            data.forEach(item => {
                if (item.room && item.room.id) {
                    map[item.room.id] = true;
                }
            });
            setWishlistMap(map);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        queueMicrotask(() => {
            fetchWishlist();
        });
    }, [fetchWishlist]);

    const toggleWishlist = useCallback(async (roomId) => {
        if (!isAuthenticated) {
            return { success: false, error: "Not authenticated" };
        }

        try {
            const result = await WishlistApi.toggle(roomId);
            
            if (result.is_wishlisted) {
                setWishlistMap(prev => ({ ...prev, [roomId]: true }));
                if (result.wishlist_item) {
                    setWishlist(prev => [result.wishlist_item, ...prev]);
                }
            } else {
                setWishlistMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[roomId];
                    return newMap;
                });
                setWishlist(prev => prev.filter(item => item.room?.id !== roomId));
            }

            return { success: true, is_wishlisted: result.is_wishlisted };
        } catch (err) {
            return { success: false, error: err };
        }
    }, [isAuthenticated]);

    const isWishlisted = useCallback((roomId) => {
        return !!wishlistMap[roomId];
    }, [wishlistMap]);

    const count = React.useMemo(() => wishlist.length, [wishlist.length]);

    const value = React.useMemo(() => ({
        wishlist,
        wishlistMap,
        loading,
        error,
        isWishlisted,
        toggleWishlist,
        refetch: fetchWishlist,
        count,
        isAuthenticated
    }), [wishlist, wishlistMap, loading, error, isWishlisted, toggleWishlist, fetchWishlist, count, isAuthenticated]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlistContext = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlistContext must be used within WishlistProvider");
    }
    return context;
};
