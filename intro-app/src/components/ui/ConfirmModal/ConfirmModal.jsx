import { motion, AnimatePresence } from 'framer-motion';
import { PiWarningCircleThin, PiXThin } from 'react-icons/pi';
import { HoverButton } from '@components/ui';
import { useLang } from '@hooks/useLang';
import './ConfirmModal.css';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    type = 'danger'
}) => {
    const { getTranslate } = useLang();
    
    const modalTitle = title || getTranslate("common", "confirmAction");
    const modalMessage = message || getTranslate("common", "areYouSure");
    const modalConfirmText = confirmText || getTranslate("common", "confirm");
    const modalCancelText = cancelText || getTranslate("common", "cancel");
    
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>

                    <motion.div
                        className="confirm-modal__backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            className="confirm-modal"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <button
                                className="confirm-modal__close"
                                onClick={onClose}
                                aria-label={getTranslate("common", "close")}
                            >
                                <PiXThin />
                            </button>

                            <div className={`confirm-modal__icon confirm-modal__icon--${type}`}>
                                <PiWarningCircleThin />
                            </div>

                            <h2 className="confirm-modal__title">{modalTitle}</h2>
                            <p className="confirm-modal__message">{modalMessage}</p>

                            <div className="confirm-modal__actions">
                                <HoverButton
                                    bgColor="transparent"
                                    hoverBgColor="rgba(170, 132, 83, 0.1)"
                                    textColor="rgba(167, 155, 155, 0.9)"
                                    textHoverColor="#aa8453"
                                    size="md"
                                    onClick={onClose}
                                    style={{
                                        border: '1px solid rgba(170, 132, 83, 0.3)',
                                        flex: 1
                                    }}
                                >
                                    {modalCancelText}
                                </HoverButton>
                                <HoverButton
                                    bgColor={type === 'danger' ? '#dc3545' : '#aa8453'}
                                    hoverBgColor={type === 'danger' ? '#c82333' : '#8a6a3d'}
                                    textColor="#fff"
                                    textHoverColor="#fff"
                                    size="md"
                                    onClick={handleConfirm}
                                    style={{ flex: 1 }}
                                >
                                    {modalConfirmText}
                                </HoverButton>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
