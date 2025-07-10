import { motion } from "framer-motion";

export function FeedButton({
    icon: Icon,
    count,
    isActive,
    activeColor,
    hoverColor,
    onClick,
}) {
    return (
        <motion.button
            onClick={onClick}
            className={`flex items-center gap-2 transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${isActive
                        ? `${activeColor} fill-current`
                        : `text-gray-400 hover:${hoverColor}`
                        }`}
                />
            </motion.div>
            <span className="text-sm text-gray-400">{count}</span>
        </motion.button>
    );
}
