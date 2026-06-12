import { useState, useCallback, createContext, useContext, useMemo } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [
            ...prev,
            {
                id,
                type: "success",
                duration: 3000,
                ...toast,
            },
        ]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const toast = useMemo(() => ({
        success: (message, duration = 3000) =>
            addToast({ message, type: "success", duration }),
        error: (message, duration = 4000) =>
            addToast({ message, type: "error", duration }),
        info: (message, duration = 3000) =>
            addToast({ message, type: "info", duration }),
    }), [addToast]);

    const value = useMemo(() => ({
        toasts,
        toast,
        removeToast
    }), [toasts, toast, removeToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};
