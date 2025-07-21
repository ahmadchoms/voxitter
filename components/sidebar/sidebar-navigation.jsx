"use client";

import {
    Home,
    Trophy,
    PenSquare,
    User,
    LogOut,
    Search,
    LayoutGrid,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function SidebarNavigation({
    onSearchClick,
    onCreateClick,
}) {
    const pathname = usePathname()
    const { data: session } = useSession();

    const navigationItems = [
        {
            title: "Beranda",
            icon: Home,
            href: "/",
        },
        {
            title: "Cari",
            icon: Search,
            onClick: onSearchClick,
        },
        {
            title: "Leaderboard",
            icon: Trophy,
            href: "/leaderboard",
        },
        {
            title: "Kategori",
            icon: LayoutGrid,
            href: "/categories",
        },
        {
            title: "Trending",
            icon: TrendingUp,
            href: "/trending",
        },
        {
            title: "Buat",
            icon: PenSquare,
            onClick: onCreateClick,
        },
        {
            title: "Profil",
            icon: User,
            href: `/${session?.user.username}`,
        },
    ];

    const handleLogout = () => {
        signOut({
            callbackUrl: "/auth/signin",
        });
    };

    return (
        <div className="w-72 h-full bg-gray-900 border-r border-gray-800 flex flex-col relative overflow-hidden">
            <motion.div
                className="p-6 border-b border-gray-800/50 relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center justify-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Voxitter
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Social Discussion Platform
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="flex-1 px-4 py-6 relative z-10">
                <nav className="space-y-2">
                    {navigationItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            {item.href ? (
                                <Link href={item.href}>
                                    <motion.div
                                        className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer relative overflow-hidden ${item.href == pathname
                                            ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                            }`}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <motion.div
                                            className={`p-2 rounded-lg ${item.href == pathname
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                : "group-hover:bg-gray-700/50"
                                                }`}
                                            whileHover={{ rotate: item.href == pathname ? 0 : 10 }}
                                        >
                                            <item.icon className="w-5 h-5" />
                                        </motion.div>
                                        <span className="font-medium text-sm tracking-wide">
                                            {item.title}
                                        </span>
                                    </motion.div>
                                </Link>
                            ) : (
                                <motion.div
                                    className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
                                    onClick={item.onClick}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <motion.div
                                        className="p-2 rounded-lg group-hover:bg-gray-700/50"
                                        whileHover={{ rotate: 10 }}
                                    >
                                        <item.icon className="w-5 h-5" />
                                    </motion.div>
                                    <span className="font-medium text-sm tracking-wide">
                                        {item.title}
                                    </span>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </nav>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

            <motion.div
                className="p-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <motion.div
                    className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-500/30"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.div
                        className="p-2 rounded-lg group-hover:bg-red-900/30"
                        whileHover={{ rotate: -10 }}
                    >
                        <LogOut className="w-5 h-5" />
                    </motion.div>
                    <span className="font-medium text-sm tracking-wide">Logout</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
