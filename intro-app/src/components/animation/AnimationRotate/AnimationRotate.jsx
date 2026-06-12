import { motion } from "framer-motion";

import "./AnimationRotate.css";

const AnimationRotate = ({ isOpen, children }) => {

    return (
        <motion.div
            className="animation-rotate"
            animate={{
                rotate: isOpen ? 180 : 0
            }}
            transition={{
                duration: 0.2,
                ease: "easeInOut",
            }}
        >

            {children}

        </motion.div>
    )
}
export default AnimationRotate;
