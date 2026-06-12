import { motion } from "framer-motion";
import "./SliderFrame.css";

const SliderFrame = ({ src, isActive, children }) => {
    return (
        <motion.div
            style={{ backgroundImage: `url(${src})` }}
            className="slider__frame-backdrop"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.8, ease: "linear" }}
            layout={false}
        >
            {children}
        </motion.div>
    );
};

export default SliderFrame;
