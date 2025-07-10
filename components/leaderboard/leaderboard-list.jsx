import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { LeaderboardCard } from "./leaderboard-card";

export const LeaderboardList = ({ users }) => {
    const remainingUsers = users.slice(3);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-200">Ranking Lengkap</h2>
            </div>

            <AnimatePresence>
                {remainingUsers.map((user, index) => (
                    <LeaderboardCard
                        key={user.id}
                        user={user}
                        index={index}
                        variant="list"
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};
