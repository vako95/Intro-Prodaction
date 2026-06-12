import { useState, useEffect, useCallback } from "react";
import { WishlistApi } from "../api/modules/wishlist";
import { AuthService } from "../services/auth";

export const useWishlist = () => {
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
        fetchWishlist();
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

    const addToWishlist = useCallback(async (roomId) => {
        if (!isAuthenticated) {
            return { success: false, error: "Not authenticated" };
        }

        try {
            const result = await WishlistApi.add(roomId);
            setWishlistMap(prev => ({ ...prev, [roomId]: true }));
            setWishlist(prev => [result, ...prev]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    }, [isAuthenticated]);

    const removeFromWishlist = useCallback(async (roomId) => {
        if (!isAuthenticated) {
            return { success: false, error: "Not authenticated" };
        }

        try {
            await WishlistApi.remove(roomId);
            setWishlistMap(prev => {
                const newMap = { ...prev };
                delete newMap[roomId];
                return newMap;
            });
            setWishlist(prev => prev.filter(item => item.room?.id !== roomId));
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    }, [isAuthenticated]);

    return {
        wishlist,
        wishlistMap,
        loading,
        error,
        isWishlisted,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        refetch: fetchWishlist,
        count: wishlist.length,
        isAuthenticated
    };
};
