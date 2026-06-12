import { motion } from "framer-motion";

const BackInDown = ({ children, trigger }) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: -100,
            scale: 0.7,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "tween",
                ease: "easeOut",
                duration: 1.2,
            },
        },
    };

    return (
        <motion.div
            className="back__in-down"
            key={trigger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={variants}
        >
            {children}
        </motion.div>
    );
};

export default BackInDown;
