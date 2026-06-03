import { motion } from "framer-motion";

const title = "Habit Tracker";

export default function AnimatedTitle() {
    return (
        <motion.h1
            style={{ display: "flex"}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {title.split("").map((char, i) =>
                char === " " ? (
                    <span key={i} style={{ width: "20px" }} />
                ) : (
                    <motion.span
                        className="app-name"
                        key={i}
                        whileHover={{ y: -12 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        style={{ display: "inline-block", cursor: "default" }}
                    >
                        {char}
                    </motion.span>
                    )
                )}
        </motion.h1>
    )
}