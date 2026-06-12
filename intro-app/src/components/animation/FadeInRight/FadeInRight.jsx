import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import "./FadeInRight.css";

const FadeInRight = ({ children, trigger }) => {
    const variants = useMemo(() => ({
        hidden: {
            opacity: 0,
            x: 128,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 1.2,
                ease: "easeOut",
            },
        },
    }), []);

    return (
        <motion.div
            className="fade__in-right"
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

export default memo(FadeInRight);
