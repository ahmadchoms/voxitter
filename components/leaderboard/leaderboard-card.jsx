import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Star, Award } from "lucide-react";
import Link from "next/link";
import { getRankIcon, getRankStyles } from "@/lib/utils/rank";

export const LeaderboardCard = ({
    user,
    index,
    variant = "list",
}) => {
    const styles = getRankStyles(user.rank);
    const RankIcon = getRankIcon(user.rank);

    if (variant === "podium" && user.rank <= 3) {
        const isFirst = user.rank === 1;
        const isSecond = user.rank === 2;

        return (
            <motion.div
                initial={{ opacity: 0, y: 60, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 100,
                }}
                className={`relative ${isFirst
                    ? "md:order-2 md:scale-110"
                    : isSecond
                        ? "md:order-1"
                        : "md:order-3"
                    }`}
            >
                <Link href={`/${user.username}`}>
                    <div
                        className={`relative group cursor-pointer ${styles.gradient} backdrop-blur-sm rounded-2xl p-8 
                                    border ${styles.border} hover:scale-105 transition-all duration-500 ease-out
                                    hover:shadow-2xl hover:shadow-blue-500/10`}
                    >
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-bold ${styles.badge} shadow-lg`}
                            >
                                #{user.rank}
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <div className="relative mb-6">
                                <div
                                    className={`relative inline-block p-1 rounded-full ${styles.avatar}`}
                                >
                                    <img
                                        src={user.avatar_url || "/user.png"}
                                        alt={user.full_name}
                                        className="w-20 h-20 rounded-full object-cover bg-slate-800"
                                    />
                                </div>

                                <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-1.5 border-2 border-slate-800">
                                    {RankIcon ? (
                                        <RankIcon
                                            className={`w-6 h-6 ${styles.icon} drop-shadow-lg`}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-slate-400 bg-slate-800/50 rounded-full border border-slate-700/50">
                                            {user.rank}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                                    {user.full_name}
                                    {user.is_verified && (
                                        <BadgeCheck
                                            className="w-5 h-5 text-white"
                                            fill="blue"
                                            stroke="white"
                                        />
                                    )}
                                </h3>
                                <p className="text-slate-400 text-sm mb-2">@{user.username}</p>
                                <p className="text-slate-500 text-xs bg-slate-800/50 rounded-full px-3 py-1 inline-block">
                                    {user.most_contributions}
                                </p>
                            </div>

                            <div
                                className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg
                ${styles.points} shadow-lg backdrop-blur-sm
              `}
                            >
                                <Star className="w-5 h-5" />
                                {user.points.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.05,
                type: "spring",
                stiffness: 120,
            }}
            whileHover={{ x: 8, scale: 1.01 }}
            className="group cursor-pointer"
        >
            <Link href={`/${user.username}`}>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-900/70 transition-all duration-300">
                    <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                            {RankIcon ? (
                                <RankIcon className={`w-6 h-6 ${styles.icon} drop-shadow-lg`} />
                            ) : (
                                <div className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-slate-400 bg-slate-800/50 rounded-full border border-slate-700/50">
                                    {user.rank}
                                </div>
                            )}
                        </div>

                        <div className="relative flex-shrink-0">
                            <img
                                src={user.avatar_url || "/user.png"}
                                alt={user.full_name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-slate-600 transition-all duration-300"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                                    {user.full_name}
                                </h4>
                                {user.is_verified && (
                                    <BadgeCheck
                                        className="w-5 h-5 text-white"
                                        fill="blue"
                                        stroke="white"
                                    />
                                )}
                            </div>
                            <p className="text-slate-400 text-sm mb-1">@{user.username}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    {user.posts_count} posts
                                </span>
                                <span>•</span>
                                <span>{user.most_contributions}</span>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 rounded-lg border border-slate-700/50 group-hover:bg-slate-700/70 transition-all duration-300">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="font-bold text-white">
                                    {user.points.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
