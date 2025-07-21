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
    Sparkles,
    Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "from-purple-500 to-blue-500" },
    { href: "/admin/users", label: "Users", icon: Users, color: "from-blue-500 to-cyan-500" },
    { href: "/admin/trending", label: "Trending", icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
]

export default function SidebarAdmin() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [hoveredItem, setHoveredItem] = useState(null)
    const pathname = usePathname()

    const handleLogout = () => {
        signOut({
            callbackUrl: "/auth/signin",
        })
    }

    return (
        <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-r border-gray-700/50 backdrop-blur-xl transition-all duration-500 z-50 ${isCollapsed ? "w-20" : "w-72"
                }`}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-cyan-900/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>

            <div className="relative flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center space-x-3"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-50"></div>
                                    <Crown className="relative h-6 w-6 text-purple-400" />
                                </motion.div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        Elite Panel
                                    </h1>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <Shield className="h-3 w-3 text-purple-400" />
                                        <span className="text-xs text-purple-300">Premium Access</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                    >
                        <motion.div
                            animate={{ rotate: isCollapsed ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                        </motion.div>
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Link href={item.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 8 }}
                                        whileTap={{ scale: 0.98 }}
                                        onHoverStart={() => setHoveredItem(item.href)}
                                        onHoverEnd={() => setHoveredItem(null)}
                                        className={`relative group flex items-center p-4 rounded-xl transition-all duration-300 ${isActive
                                                ? `bg-gradient-to-r ${item.color} shadow-lg shadow-purple-500/25`
                                                : "hover:bg-gray-800/50"
                                            }`}
                                    >
                                        {/* Active indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-10"
                                                style={{
                                                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                                                    '--tw-gradient-from': 'rgb(168 85 247)',
                                                    '--tw-gradient-to': 'rgb(59 130 246)'
                                                }}
                                            />
                                        )}

                                        {/* Hover glow effect */}
                                        <AnimatePresence>
                                            {hoveredItem === item.href && !isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10"
                                                />
                                            )}
                                        </AnimatePresence>

                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                            className="relative"
                                        >
                                            <Icon
                                                size={20}
                                                className={`relative z-10 transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                                                    }`}
                                            />
                                            {isActive && (
                                                <div className="absolute inset-0 bg-white rounded-full blur opacity-30"></div>
                                            )}
                                        </motion.div>

                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className={`ml-4 font-semibold transition-colors duration-300 ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                                                        }`}
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {/* Sparkle effect for active item */}
                                        {isActive && !isCollapsed && (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="ml-auto"
                                            >
                                                <Sparkles className="h-4 w-4 text-purple-200" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="p-4 border-t border-gray-700/30"
                >
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className={`w-full group justify-start text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-300 ${isCollapsed ? "px-3" : ""
                            }`}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <LogOut size={20} />
                        </motion.div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="ml-3 font-semibold"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}