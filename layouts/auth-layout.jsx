"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.02 },
};

export function AuthCard({
    children,
    title,
    description,
    icon,
}) {
    return (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-6">
                <CardTitle className="text-white flex items-center justify-center gap-2 text-xl">
                    {icon}
                    {title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">{children}</CardContent>
        </Card>
    );
}

export function AuthLayout({
    children,
    subtitle,
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <motion.div
                            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <MessageSquare className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Voxitter
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg">{subtitle}</p>
                </motion.div>

                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {children}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center mt-6"
                >
                    <Button
                        variant="ghost"
                        asChild
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Kembali ke beranda
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
