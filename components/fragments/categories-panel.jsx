"use client";

import { useEffect, useState } from "react";
import { Telescope, TrendingUp, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import StarRating from "../trending/star-rating";
import { toast } from "sonner";
import { useTrendingTopics } from "@/hooks/use-trending";
import { useCategories } from "@/hooks/use-categories";

export default function CategoryPanel() {
    const [categories, setCategories] = useState([]);
    const { data: session } = useSession();
    const { topTopics: trendingTopics, rateTopic } = useTrendingTopics(session?.user?.id);
    const { categories: allCategories } = useCategories();

    useEffect(() => {
        if (allCategories && allCategories.length > 0) {
            setCategories(allCategories.map(category => ({
                ...category,
                icon: getCategoryIcon(category.name)
            })));
        }
    }, [allCategories]);

    const getCategoryIcon = (categoryName) => {
        const icons = {
            "Politik": "🏛️",
            "Ekonomi": "💰",
            "Hukum": "⚖️",
            "Teknologi": "🚀",
            "Kesehatan": "🏥",
            "Pendidikan": "📚",
            "Lingkungan": "🌿",
            "Sosial": "👥",
            "Budaya dan Agama": "🕉️",
            "Digitalisasi dan Privasi": "🔒",
            "Energi dan SDA": "⚡",
            "Infrastruktur": "🏗️",
            "Ketahanan Pangan": "🌾",
            "Pemerintahan dan Birokrasi": "🏢",
            "Pertahanan dan Keamanan": "🛡️",
            "Transportasi": "🚗"
        };
        return icons[categoryName] || "📌";
    };

    const totalPosts = categories.reduce((sum, category) => sum + category.post_count, 0);

    const handleRateTopic = async (topicId, newRating) => {
        const { success, error } = await rateTopic(topicId, newRating);

        if (success) {
            toast.success("Rating submitted successfully!");
        } else {
            toast.error("Failed to submit rating" + (error ? `: ${error}` : ""));
        }
    };

    return (
        <div className="space-y-8">
            <Card className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30">
                            <TrendingUp className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white tracking-tight">
                                Topik Hangat dari AI
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                                Topik dengan rating tertinggi
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {trendingTopics.length > 0 ? (
                        trendingTopics.map((topic, index) => (
                            <motion.div
                                key={topic.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.2,
                                    ease: [0.25, 0.4, 0.25, 1],
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.2 },
                                }}
                                className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group backdrop-blur-sm`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white text-base leading-tight group-hover:text-orange-300 transition-colors duration-300">
                                            {topic.title}
                                        </h4>
                                        <Badge
                                            variant="outline"
                                            className="mt-3 text-xs border-gray-500/50 text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full font-medium"
                                        >
                                            {topic.category}
                                        </Badge>
                                        <div className="flex items-center gap-1 mt-3 ml-2">
                                            <StarRating
                                                rating={parseFloat(topic.average_rating)}
                                                userRating={topic.userRating}
                                                onRate={(newRating) => handleRateTopic(topic.id, newRating)}
                                                size={14}
                                                disabled={!session}
                                            />
                                            <span className="text-xs text-gray-400">({topic.total_ratings})</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-4">Loading top topics or no topics available...</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                            <Telescope className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white tracking-tight">
                                Jelajahi Kategori
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                                Temukan diskusi berdasarkan kategori
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.08,
                                    ease: [0.25, 0.4, 0.25, 1],
                                }}
                                whileHover={{
                                    scale: 1.01,
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <Button
                                    variant="ghost"
                                    className="justify-start h-auto p-4 rounded-2xl hover:bg-gray-700/40 transition-all duration-300 border border-transparent hover:border-gray-600/50 group w-full"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <span className="text-lg">{category.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="max-w-40 truncate font-semibold text-white text-sm leading-tight group-hover:text-blue-300 transition-colors duration-300">
                                                    {category.name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400">
                                                        {category.post_count.toLocaleString()}
                                                    </span>
                                                    {totalPosts > 0 ? (
                                                        <span className="text-xs text-gray-500">
                                                            ({((category.post_count / totalPosts) * 100).toFixed(1)}%)
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">(0%)</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full relative overflow-hidden"
                                                    style={{
                                                        width: totalPosts === 0 ? "0%" : `${(category.post_count / totalPosts) * 100}%`,
                                                        backgroundColor: category.color
                                                    }}
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: totalPosts === 0 ? "0%" : `${(category.post_count / totalPosts) * 100}%`,
                                                    }}
                                                    transition={{
                                                        duration: 1.2,
                                                        delay: index * 0.1,
                                                        ease: [0.25, 0.4, 0.25, 1],
                                                    }}
                                                >
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                        initial={{ x: '-100%' }}
                                                        animate={{ x: '100%' }}
                                                        transition={{
                                                            duration: 1.5,
                                                            delay: index * 0.1 + 0.5,
                                                            ease: "easeInOut",
                                                        }}
                                                    />
                                                </motion.div>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}