import { useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";
import "./Toast.css";

const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    info: <FaInfoCircle />,
};

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <motion.div
            className={`toast toast--${type}`}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="toast__icon">{icons[type]}</div>
            <div className="toast__message">{message}</div>
            <button className="toast__close" onClick={onClose}>
                <FaTimes />
            </button>
        </motion.div>
    );
};

export default memo(Toast);
