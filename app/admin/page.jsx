"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Activity, ArrowUpRight, Sparkles, Crown } from "lucide-react";
import { usersService } from "@/lib/supabase/users";
import { postsService } from "@/lib/supabase/posts";
import AdminLayout from "@/layouts/admin-layout";
import StatsChart from "@/components/admin/stats-chart";

const StatCard = ({ title, value, icon: Icon, trend, delay, gradient, bgPattern }) => (
    <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.03, y: -8 }}
        className="group relative overflow-hidden"
    >
        <Card className="relative bg-gradient-to-br from-gray-900/90 via-gray-900/60 to-gray-800/90 border border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
            <div className={`absolute inset-0 opacity-5 ${bgPattern}`}></div>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-300 tracking-wide uppercase">{title}</CardTitle>
                <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-50"></div>
                    <Icon className="relative h-5 w-5 text-purple-400 group-hover:text-white transition-colors duration-300" />
                </motion.div>
            </CardHeader>
            <CardContent className="relative">
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                    {value}
                </div>
                <AnimatePresence>
                    {trend && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-1"
                        >
                            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium">+{trend}%</span>
                            <span className="text-xs text-gray-400">from last month</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    </motion.div>
);

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        activeUsers: 0,
        engagement: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersResponse, postsResponse] = await Promise.all([
                    usersService.getAllUsers(),
                    postsService.getAllPosts(),
                ]);

                setStats({
                    totalUsers: usersResponse.data?.length || 0,
                    totalPosts: postsResponse.data?.length || 0,
                    activeUsers: usersResponse.data?.filter((user) => user.is_verified)?.length || 0,
                    engagement: Math.round(Math.random() * 100),
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="relative"
                    >
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-ping"></div>
                    </motion.div>
                </div>
            </AdminLayout>
        );
    }

    const statConfigs = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            trend: 12,
            gradient: "from-purple-500 to-blue-600",
            bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]",
        },
        {
            title: "Total Posts",
            value: stats.totalPosts.toLocaleString(),
            icon: FileText,
            trend: 8,
            gradient: "from-blue-500 to-cyan-600",
            bgPattern: "bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent)]",
        },
        {
            title: "Active Users",
            value: stats.activeUsers.toLocaleString(),
            icon: Activity,
            trend: 15,
            gradient: "from-emerald-500 to-teal-600",
            bgPattern: "bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.1),transparent)]",
        },
        {
            title: "Engagement",
            value: `${stats.engagement}%`,
            icon: TrendingUp,
            trend: 5,
            gradient: "from-orange-500 to-red-600",
            bgPattern: "bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.1),transparent)]",
        },
    ];

    const performanceData = [
        { month: "Jan", value: 400 },
        { month: "Feb", value: 300 },
        { month: "Mar", value: 600 },
        { month: "Apr", value: 800 },
        { month: "May", value: 700 },
        { month: "Jun", value: 900 },
    ];

    return (
        <AdminLayout>
            <div className="relative min-h-screen">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/5 to-cyan-900/10"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative space-y-12 z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <Card className="bg-gradient-to-br from-gray-900/90 via-gray-900/60 to-gray-800/90 border border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                            <CardHeader>
                                <div className="flex items-center space-x-3 mb-4">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Crown className="h-8 w-8 text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text" />
                                    </motion.div>
                                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                                        Executive Dashboard of Voxitter - {new Date().getFullYear()}
                                    </h1>
                                </div>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {statConfigs.map((config, index) => (
                            <StatCard
                                key={config.title}
                                {...config}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid gap-8 md:grid-cols-2"
                    >
                        <StatsChart
                            title="Users Growth Analytics"
                            subtitle="Premium user acquisition trends"
                            data={performanceData}
                            gradient="from-purple-500 to-blue-600"
                            accentColor="#8b5cf6"
                        />
                        <StatsChart
                            title="Content Performance"
                            subtitle="Engagement and reach metrics"
                            data={[
                                { month: "Jan", value: 200 },
                                { month: "Feb", value: 400 },
                                { month: "Mar", value: 300 },
                                { month: "Apr", value: 500 },
                                { month: "May", value: 600 },
                                { month: "Jun", value: 750 },
                            ]}
                            gradient="from-emerald-500 to-cyan-600"
                            accentColor="#10b981"
                        />
                    </motion.div>

                </motion.div>
            </div>
        </AdminLayout>
    );
}