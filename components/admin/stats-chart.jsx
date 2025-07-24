"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, LineChart, PieChart as PieChartIcon } from "lucide-react";
import {
    LineChart as RechartsLineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer,
} from "recharts";

const colorVariants = {
    blue: {
        gradient: "from-blue-500 to-blue-600",
        light: "from-blue-400 to-blue-500",
        bg: "bg-blue-950/20",
        text: "text-blue-400",
        chartColor: "#60A5FA",
        pieColors: ["#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8"],
    },
    emerald: {
        gradient: "from-emerald-500 to-emerald-600",
        light: "from-emerald-400 to-emerald-500",
        bg: "bg-emerald-950/20",
        text: "text-emerald-400",
        chartColor: "#34D399",
        pieColors: ["#34D399", "#10B981", "#059669", "#047857"],
    },
    purple: {
        gradient: "from-purple-500 to-purple-600",
        light: "from-purple-400 to-purple-500",
        bg: "bg-purple-950/20",
        text: "text-purple-400",
        chartColor: "#A78BFA",
        pieColors: ["#A78BFA", "#8B5CF6", "#7C3AED", "#6D28D9"],
    },
};

export default function StatsChart({ title, subtitle, data, color = "blue", chartType = "line" }) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <Card className="bg-gray-900/70 border border-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
                    <p className="text-sm text-gray-400">{subtitle}</p>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-400">No data available</p>
                </CardContent>
            </Card>
        );
    }

    const colors = colorVariants[color];
    const Icon = chartType === "line" ? LineChart : chartType === "bar" ? BarChart3 : PieChartIcon;

    const renderChart = () => {
        switch (chartType) {
            case "line":
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <RechartsLineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "1px solid #4B5563",
                                    borderRadius: "0.5rem",
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                                labelStyle={{ color: "#9CA3AF" }}
                            />
                            <Legend wrapperStyle={{ color: "#9CA3AF" }} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={colors.chartColor}
                                strokeWidth={2}
                                dot={{ r: 4, fill: colors.chartColor, strokeWidth: 1 }}
                                activeDot={{ r: 6, fill: colors.chartColor, stroke: "#E5E7EB", strokeWidth: 2 }}
                            />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                );
            case "bar":
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "1px solid #4B5563",
                                    borderRadius: "0.5rem",
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                                labelStyle={{ color: "#9CA3AF" }}
                            />
                            <Legend wrapperStyle={{ color: "#9CA3AF" }} />
                            <Bar dataKey="value" fill={colors.chartColor} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case "pie":
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="month"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors.pieColors[index % colors.pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "1px solid #4B5563",
                                    borderRadius: "0.5rem",
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                                labelStyle={{ color: "#9CA3AF" }}
                            />
                            <Legend wrapperStyle={{ color: "#9CA3AF" }} />
                        </PieChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -2 }}
            className="group"
        >
            <Card className="bg-gray-900/70 border border-gray-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold text-white mb-1">{title}</CardTitle>
                            <p className="text-sm text-gray-400">{subtitle}</p>
                        </div>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.gradient}`}>
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {renderChart()}
                    <div className={`p-3 rounded-lg ${colors.bg} border border-gray-700/30 mt-6`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className={`h-4 w-4 ${colors.text}`} />
                                <span className="text-sm font-medium text-white">Trend Analysis</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-white">
                                    {data.length >= 2 ? ((data[data.length - 1]?.value / data[0]?.value - 1) * 100).toFixed(1) : "N/A"}%
                                </div>
                                <div className="text-xs text-gray-400">Growth rate</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}