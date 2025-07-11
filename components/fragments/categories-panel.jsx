"use client";

import { ChartBar, MessageCircle, Telescope, TrendingUp, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export default function CategoryPanel() {
    const trendingTopics = [
        { title: "Kebijakan Ekonomi Baru", posts: 1234, category: "Ekonomi" },
        { title: "Reformasi Pendidikan", posts: 856, category: "Pendidikan" },
        { title: "Teknologi AI di Indonesia", posts: 642, category: "Teknologi" },
    ];

    const categories = [
        { name: "Politik", count: 2341, color: "bg-red-500/10 text-red-400" },
        { name: "Ekonomi", count: 1876, color: "bg-green-500/10 text-green-400" },
        { name: "Hukum", count: 1234, color: "bg-blue-500/10 text-blue-400" },
        {
            name: "Teknologi",
            count: 987,
            color: "bg-purple-500/10 text-purple-400",
        },
        {
            name: "Kesehatan",
            count: 765,
            color: "bg-orange-500/10 text-orange-400",
        },
        { name: "Pendidikan", count: 654, color: "bg-teal-500/10 text-teal-400" },
        {
            name: "Lingkungan",
            count: 432,
            color: "bg-emerald-500/10 text-emerald-400",
        },
        { name: "Sosial", count: 321, color: "bg-pink-500/10 text-pink-400" },
    ];

    const stats = [
        {
            label: "Total Pengguna",
            value: 12456,
            icon: <Users className="w-4 h-4" />,
        },
        {
            label: "Post Hari Ini",
            value: 1234,
            icon: <MessageCircle className="w-4 h-4" />,
        },
        {
            label: "Diskusi Aktif",
            value: 456,
            icon: <ChartBar className="w-4 h-4" />,
        },
    ];

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-none shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                        <h3 className="font-bold text-lg text-white tracking-tight">
                            Topik Hangat
                        </h3>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.15,
                                ease: "easeOut",
                            }}
                            className="p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group"
                        >
                            <h4 className="font-medium text-white text-sm leading-tight group-hover:text-orange-400 transition-colors duration-200">
                                {topic.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant="outline"
                                    className="text-xs border-gray-600 text-gray-300 bg-gray-800/50"
                                >
                                    {topic.category}
                                </Badge>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    {topic.posts.toLocaleString()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-none shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <Telescope className="w-6 h-6 text-blue-400" />
                        <h3 className="font-bold text-lg text-white tracking-tight">
                            Jelajahi Kategori
                        </h3>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-1">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Button
                                    variant="ghost"
                                    className="justify-between h-auto p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                                >
                                    <h4 className="font-medium text-white text-sm leading-tight hover:text-blue-400 transition-colors duration-200">
                                        {category.name}
                                    </h4>
                                    <Badge
                                        className={`text-xs ${category.color} font-medium border-none`}
                                    >
                                        {category.count.toLocaleString()}
                                    </Badge>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
