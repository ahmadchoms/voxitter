import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export const LeaderboardHeader = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
        >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800/50">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Leaderboard</span>
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Top Contributors
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Pengguna dengan kontribusi terbesar di komunitas Voxitter
            </p>
        </motion.div>
    );
};
