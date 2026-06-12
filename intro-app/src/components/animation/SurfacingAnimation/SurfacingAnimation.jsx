import { AnimatePresence, motion } from "framer-motion";
import "./SurfacingAnimation.css";

const SurfacingAnimation = ({ children }) => {
    return (

        <motion.div
            className="surfacing-animation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "linear" }}
        >
            {children}
        </motion.div>

    );
};

export default SurfacingAnimation;
