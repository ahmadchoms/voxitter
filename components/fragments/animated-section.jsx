import { motion } from "framer-motion";

export function AnimatedSection({ children, delay = 0, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className={`${className} space-y-2`}
        >
            {children}
        </motion.div>
    );
}