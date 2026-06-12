import "./ModalContainer.css";
import { createPortal } from "react-dom";
import { useMemo, memo } from "react";

import { motion, AnimatePresence } from "framer-motion";
const ModalContainer = ({
    containerId = "#root",
    onClose,
    isOpen = false,
    children,
    ...props
}) => {

    const portalRoot = useMemo(() => (
        document.querySelector(containerId)
    ), [containerId]);

    if (!portalRoot) return null;


    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.section
                    className="motion__container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    {...props}

                >
                    {children}
                </motion.section>
            )}
        </AnimatePresence>,
        portalRoot
    )
}

export default memo(ModalContainer);