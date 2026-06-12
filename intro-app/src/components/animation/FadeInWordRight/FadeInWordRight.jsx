import { motion } from "framer-motion";
import "./FadeInWordRight.css";
const FadeInWordRight = ({ children, custom, direction = "right" }) => {
    const directionMap = {
        right: { x: 30, y: 0 },
        left: { x: -30, y: 0 },
        up: { x: 0, y: -30 },
        down: { x: 0, y: 30 },
        none: { x: 0, y: 0 },
    };

    const { x, y } = directionMap[direction] || directionMap.right;

    const variants = {
        hidden: {
            opacity: 0,
            x,
            y,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                delay: custom * 0.05,
            },
        },
    };

    return (
        <motion.span
            className="fade-in-word"
            custom={custom}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={variants}
            style={{ display: "inline-block" }}
        >
            {children}
        </motion.span>
    );
};

export default FadeInWordRight;
