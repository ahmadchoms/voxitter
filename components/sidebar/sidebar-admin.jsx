"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    LogOut,
    Menu,
    X,
    Crown,
    Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/trending", label: "Trending", icon: TrendingUp },
]

export default function SidebarAdmin() {
    const pathname = usePathname()

    const handleLogout = () => {
        signOut({
            callbackUrl: "/auth/signin",
        })
    }

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed left-0 top-0 h-full bg-gray-950/95 border-r border-gray-800/50 backdrop-blur-xl transition-all duration-300 z-50 w-64"
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center space-x-3"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Crown className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white">
                            Admin Panel
                        </h1>
                        <p className="text-xs text-gray-200">
                            Management System
                        </p>
                    </div>
                </motion.div>
            </div>

            <nav className="flex-1 p-3 space-y-1">
                {menuItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                            <Link href={item.href}>
                                <motion.div
                                    whileHover={{ x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                        ? "bg-blue-950/90 text-blue-300"
                                        : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 w-0.5 h-6 bg-blue-400 rounded-r-full"
                                        />
                                    )}

                                    <Icon size={18} className="flex-shrink-0" />

                                    <motion.span
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -5 }}
                                        className="ml-3 font-medium text-sm"
                                    >
                                        {item.label}
                                    </motion.span>
                                </motion.div>
                            </Link>
                        </motion.div>
                    )
                })}
            </nav>

            <div className="p-3 border-t border-gray-800/50 space-y-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                    <Settings size={18} />
                    <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="ml-3 text-sm font-medium"
                    >
                        Settings
                    </motion.span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/80"
                >
                    <LogOut size={18} />
                    <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="ml-3 text-sm font-medium"
                    >
                        Logout
                    </motion.span>
                </Button>
            </div>
        </motion.div>
    )
}