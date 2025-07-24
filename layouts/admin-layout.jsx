"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SidebarAdmin from "@/components/sidebar/sidebar-admin"

export default function AdminLayout({ children }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-gray-950">
            <SidebarAdmin />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="ml-64 p-6 min-h-screen"
            >
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </motion.main>
        </div>
    )
}