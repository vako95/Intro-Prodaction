import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    useEffect(() => {
        queueMicrotask(() => {
            try {
                localStorage.setItem('cart', JSON.stringify(cartItems));
            } catch (e) {
            }
        });
    }, [cartItems]);

    const addToCart = useCallback((item) => {
        setCartItems(prev => {
            const existing = prev.find(i => 
                i.room_id === item.room_id && 
                i.check_in === item.check_in && 
                i.check_out === item.check_out
            );
            
            if (existing) {
                return prev.map(i => 
                    i.room_id === item.room_id && 
                    i.check_in === item.check_in && 
                    i.check_out === item.check_out
                        ? { ...i, rooms_count: i.rooms_count + item.rooms_count }
                        : i
                );
            }
            
            const newItem = { ...item, id: Date.now() };
            return [...prev, newItem];
        });
        
        setIsCartModalOpen(true);
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateCartItem = useCallback((id, updates) => {
        setCartItems(prev => prev.map(item => 
            item.id === id ? { ...item, ...updates } : item
        ));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getCartTotal = useCallback(() => {
        return cartItems.reduce((sum, item) => sum + (item.total_cost || 0), 0);
    }, [cartItems]);
    
    const openCartModal = useCallback(() => setIsCartModalOpen(true), []);
    const closeCartModal = useCallback(() => setIsCartModalOpen(false), []);

    const cartCount = useMemo(() => cartItems.length, [cartItems.length]);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        getCartTotal,
        cartCount,
        isCartModalOpen,
        openCartModal,
        closeCartModal
    }), [cartItems, addToCart, removeFromCart, updateCartItem, clearCart, getCartTotal, cartCount, isCartModalOpen, openCartModal, closeCartModal]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
