"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function StatsChart({ title, subtitle, data, gradient, accentColor }) {
    // Validate data prop
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <Card className="bg-gradient-to-br from-gray-900/90 via-gray-900/60 to-gray-800/90 border border-gray-700/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">{title}</CardTitle>
                    <p className="text-sm text-gray-400 font-light">{subtitle}</p>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-400">No data available</p>
                </CardContent>
            </Card>
        );
    }

    const maxValue = Math.max(...data.map((item) => item.value), 1); // Avoid division by zero

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group relative"
        >
            <Card className="relative bg-gradient-to-br from-gray-900/90 via-gray-900/60 to-gray-800/90 border border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-cyan-900/5"></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                                {title}
                            </CardTitle>
                            <p className="text-sm text-gray-400 font-light">{subtitle}</p>
                        </div>
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-50"></div>
                            <BarChart3 className="relative h-6 w-6 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300" />
                        </motion.div>
                    </div>
                </CardHeader>

                <CardContent className="relative">
                    <div className="flex items-end justify-between space-x-3 h-48 mb-4" role="region" aria-label={`${title} bar chart`}>
                        {data.map((item, index) => (
                            <div key={item.month} className="flex-1 flex flex-col items-center group/bar" role="group" aria-label={`Data for ${item.month}`}>
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: `${(item.value / maxValue) * 100}%`, opacity: 1 }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.8,
                                        ease: "easeOut",
                                    }}
                                    whileHover={{ scaleY: 1.05 }}
                                    className="w-full rounded-t-lg relative overflow-hidden cursor-pointer"
                                    style={{ minHeight: "20px" }}
                                    role="img"
                                    aria-label={`Bar for ${item.month} with value ${item.value.toLocaleString()}`}
                                >
                                    <div className={`w-full h-full bg-gradient-to-t ${gradient} relative`} />
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover/bar:opacity-50 blur-sm transition-opacity duration-300`}
                                    />
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileHover={{ opacity: 1, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg"
                                    >
                                        {item.value.toLocaleString()}
                                    </motion.div>
                                </motion.div>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                    className="text-xs text-gray-400 mt-3 font-medium group-hover/bar:text-white transition-colors duration-300"
                                >
                                    {item.month}
                                </motion.span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}