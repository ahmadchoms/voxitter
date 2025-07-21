"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, Search, Users as UsersIcon, Crown, Sparkles, Shield, Eye, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { usersService } from "@/lib/supabase/users"
import AdminLayout from "@/layouts/admin-layout"
import UserModal from "@/components/admin/user-modal"

export default function Users() {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [hoveredRow, setHoveredRow] = useState(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredUsers(filtered)
    }, [users, searchTerm])

    const fetchUsers = async () => {
        try {
            const data = await usersService.getAllUsers()
            setUsers(data || [])
        } catch (error) {
            toast.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                await usersService.deleteUser(userId)
                toast.success("User deleted successfully")
                fetchUsers()
            } catch (error) {
                toast.error("Failed to delete user")
            }
        }
    }

    const handleEdit = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setSelectedUser(null)
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
        fetchUsers()
    }

    // Calculate stats
    const totalUsers = users.length
    const adminUsers = users.filter(user => user.role === 'admin').length
    const verifiedUsers = users.filter(user => user.is_verified).length
    const totalPoints = users.reduce((acc, user) => acc + (user.points || 0), 0)

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-50"></div>
                        <div className="relative w-8 h-8 border-4 border-transparent border-t-purple-500 border-r-cyan-500 rounded-full"></div>
                    </motion.div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-8"
            >
                {/* Background Effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.7 }}
                    className="relative"
                >
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <motion.div
                                className="flex items-center space-x-4"
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-50"></div>
                                    <UsersIcon className="relative h-8 w-8 text-purple-400" />
                                </motion.div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                                        User Management
                                    </h1>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Shield className="h-4 w-4 text-purple-400" />
                                        <span className="text-sm text-purple-300">Elite Access Panel</span>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Sparkles className="h-4 w-4 text-cyan-400" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={handleCreate}
                                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-0 shadow-lg shadow-purple-500/25 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <motion.div
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                </motion.div>
                                Create User
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {[
                        { label: "Total Users", value: totalUsers, icon: UsersIcon, color: "from-purple-500 to-blue-500", bg: "from-purple-500/20 to-blue-500/20" },
                        { label: "Admin Users", value: adminUsers, icon: Crown, color: "from-orange-500 to-red-500", bg: "from-orange-500/20 to-red-500/20" },
                        { label: "Verified", value: verifiedUsers, icon: Shield, color: "from-emerald-500 to-teal-500", bg: "from-emerald-500/20 to-teal-500/20" },
                        { label: "Total Points", value: totalPoints.toLocaleString(), icon: TrendingUp, color: "from-cyan-500 to-indigo-500", bg: "from-cyan-500/20 to-indigo-500/20" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.bg} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                        <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className="relative"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full blur opacity-50`}></div>
                                        <stat.icon className={`relative h-8 w-8 text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`} />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="relative max-w-md"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search users by email, username, or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0"
                        />
                    </div>
                </motion.div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 rounded-2xl"></div>
                    <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/50 transition-all duration-500">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800/50 hover:bg-gray-800/30">
                                    {["Email", "Username", "Full Name", "Role", "Verified", "Points", "Posts", "Created", "Actions"].map((header, index) => (
                                        <TableHead key={header} className="text-gray-300 font-semibold border-b border-gray-700/50">
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.05 * index }}
                                            >
                                                {header}
                                            </motion.div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {filteredUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: 0.05 * index, duration: 0.5 }}
                                            onHoverStart={() => setHoveredRow(user.id)}
                                            onHoverEnd={() => setHoveredRow(null)}
                                            className="border-gray-800/50 group hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-cyan-500/10 transition-all duration-300"
                                        >
                                            <TableCell className="text-white font-medium">
                                                <motion.div
                                                    animate={hoveredRow === user.id ? { scale: 1.05 } : { scale: 1 }}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                                                    <span>{user.email}</span>
                                                </motion.div>
                                            </TableCell>
                                            <TableCell className="text-white">{user.username}</TableCell>
                                            <TableCell className="text-white">{user.full_name}</TableCell>
                                            <TableCell>
                                                <motion.div whileHover={{ scale: 1.1 }}>
                                                    <Badge
                                                        className={`${user.role === "admin"
                                                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0"
                                                                : "bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0"
                                                            }`}
                                                    >
                                                        {user.role === "admin" && <Crown className="w-3 h-3 mr-1" />}
                                                        {user.role}
                                                    </Badge>
                                                </motion.div>
                                            </TableCell>
                                            <TableCell>
                                                <motion.div whileHover={{ scale: 1.1 }}>
                                                    <Badge
                                                        className={`${user.is_verified
                                                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
                                                                : "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0"
                                                            }`}
                                                    >
                                                        {user.is_verified && <Shield className="w-3 h-3 mr-1" />}
                                                        {user.is_verified ? "Verified" : "Pending"}
                                                    </Badge>
                                                </motion.div>
                                            </TableCell>
                                            <TableCell className="text-white font-semibold">
                                                <div className="flex items-center space-x-1">
                                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                                    <span>{user.points || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-white">{user.post_count || 0}</TableCell>
                                            <TableCell className="text-gray-300">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleEdit(user)}
                                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white shadow-lg shadow-blue-500/25"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleDelete(user.id)}
                                                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 border-0 text-white shadow-lg shadow-red-500/25"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </motion.div>

                <UserModal isOpen={isModalOpen} onClose={handleModalClose} user={selectedUser} />
            </motion.div>
        </AdminLayout>
    )
}