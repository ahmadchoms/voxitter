import React from "react";
import { motion } from "framer-motion";
import { LeaderboardCard } from "./leaderboard-card";

export const LeaderboardPodium = ({
    topThree,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
            {topThree.map((user, index) => (
                <LeaderboardCard
                    key={user.id}
                    user={user}
                    index={index}
                    variant="podium"
                />
            ))}
        </motion.div>
    );
};
