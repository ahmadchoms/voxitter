"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Activity, ArrowUpRight } from "lucide-react";
import { usersService } from "@/lib/supabase/users";
import { postsService } from "@/lib/supabase/posts";
import AdminLayout from "@/layouts/admin-layout";
import StatsChart from "@/components/admin/stats-chart";
import { commentsService } from "@/lib/supabase/comments";
import { likesService } from "@/lib/supabase/likes";

const StatCard = ({ title, value, icon: Icon, trend, delay, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ y: -2 }}
        className="group"
    >
        <Card className="relative bg-gray-900/70 border border-gray-800/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <AnimatePresence>
                    {trend && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center text-xs"
                        >
                            <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-400 font-medium">+{trend}%</span>
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    </motion.div>
);

export default function DashboardAdminPage() {
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
                const [
                    usersResponse,
                    postsResponse,
                    commentsResponse,
                    likesResponse,
                ] = await Promise.all([
                    usersService.getAllUsers(),
                    postsService.getAllPosts(),
                    commentsService.getCountComments(),
                    likesService.getCountLikes(),
                ]);

                const totalUsers = usersResponse?.data?.length || 0;
                const totalPosts = postsResponse.data?.length || 0;
                const totalComments = commentsResponse.data || 0;
                const totalLikes = likesResponse.data || 0;

                const activeUsers = usersResponse?.data?.filter((user) => user.is_verified)?.length || 0;

                const engagementRate =
                    totalPosts > 0
                        ? Math.round(((totalComments + totalLikes) / totalPosts) * 100)
                        : 0;

                setStats({
                    totalUsers,
                    totalPosts,
                    activeUsers,
                    totalComments,
                    totalLikes,
                    engagement: engagementRate,
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
                    <motion.div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [-8, 8, -8] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-3 h-3 bg-blue-500 rounded-full"
                            />
                        ))}
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
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Total Posts",
            value: stats.totalPosts.toLocaleString(),
            icon: FileText,
            trend: 8,
            color: "from-emerald-500 to-emerald-600",
        },
        {
            title: "Active Users",
            value: stats.activeUsers.toLocaleString(),
            icon: Activity,
            trend: 15,
            color: "from-purple-500 to-purple-600",
        },
        {
            title: "Engagement",
            value: `${stats.engagement}%`,
            icon: TrendingUp,
            trend: 5,
            color: "from-orange-500 to-orange-600",
        },
    ];

    // Mock Data
    const userGrowthData = [
        { month: "Jan", value: 400 },
        { month: "Feb", value: 300 },
        { month: "Mar", value: 600 },
        { month: "Apr", value: 800 },
        { month: "May", value: 700 },
        { month: "Jun", value: 900 },
        { month: "Jul", value: 1100 },
    ];

    const contentPerformanceData = [
        { month: "Jan", value: 200 },
        { month: "Feb", value: 400 },
        { month: "Mar", value: 300 },
        { month: "Apr", value: 500 },
        { month: "May", value: 600 },
        { month: "Jun", value: 750 },
        { month: "Jul", value: 850 },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                            <p className="text-gray-400 mt-1">Selamat datang di halaman dashboard!</p>
                        </div>
                        <div className="text-sm text-gray-400">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statConfigs.map((config, index) => (
                        <StatCard key={config.title} {...config} delay={index * 0.1} />
                    ))}
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <StatsChart
                        title="User Growth"
                        subtitle="Monthly user acquisition trends"
                        data={userGrowthData}
                        color="blue"
                        chartType="line"
                    />
                    <StatsChart
                        title="Content Performance"
                        subtitle="Post engagement metrics"
                        data={contentPerformanceData}
                        color="emerald"
                        chartType="bar"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="bg-gray-900/70 border border-gray-800/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white">Recent Activity</CardTitle>
                            <p className="text-sm text-gray-400">Latest updates from your platform</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { action: "New user registered", time: "2 minutes ago", type: "user" },
                                    { action: "Post published", time: "5 minutes ago", type: "post" },
                                    { action: "User verification completed", time: "10 minutes ago", type: "verification" },
                                    { action: "New trending topic", time: "15 minutes ago", type: "trending" },
                                ].map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-2 h-2 rounded-full ${activity.type === "user"
                                                        ? "bg-blue-500"
                                                        : activity.type === "post"
                                                            ? "bg-emerald-500"
                                                            : activity.type === "verification"
                                                                ? "bg-purple-500"
                                                                : "bg-orange-500"
                                                    }`}
                                            />
                                            <span className="text-sm text-white font-medium">{activity.action}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{activity.time}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AdminLayout>
    );
}