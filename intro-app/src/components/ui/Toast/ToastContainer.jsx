import { AnimatePresence } from "framer-motion";
import Toast from "./Toast";
import { useToast } from "./useToast.jsx";

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <AnimatePresence mode="sync">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{
                        position: "fixed",
                        top: `${24 + index * 90}px`,
                        right: "24px",
                        zIndex: 99999,
                    }}
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                        duration={toast.duration}
                    />
                </div>
            ))}
        </AnimatePresence>
    );
};

export default ToastContainer;
