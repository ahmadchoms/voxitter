"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, Users as UsersIcon, Crown, Sparkles, Shield, TrendingUp, CircleAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usersService } from "@/lib/supabase/users";
import AdminLayout from "@/layouts/admin-layout";
import UserModal from "@/components/admin/user-modal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUsers } from "@/hooks/use-users";

const StatCard = ({ title, value, icon: Icon, delay, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ y: -2 }}
        className="group"
    >
        <Card className="bg-gray-900/70 border border-gray-800/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
            </CardContent>
        </Card>
    </motion.div>
);

export default function UsersAdminPage() {
    const { users, loading, error, refetch } = useUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter(
            (user) =>
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const confirmDelete = useCallback((userId) => {
        setUserToDelete(userId);
        setIsConfirmDialogOpen(true);
    }, []);

    const handleDelete = useCallback(async () => {
        if (!userToDelete) return;

        setIsConfirmDialogOpen(false);
        try {
            await usersService.deleteUser(userToDelete);
            toast.success("User deleted successfully.");
            refetch();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.", {
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setUserToDelete(null);
        }
    }, [userToDelete, refetch]);

    const handleEdit = useCallback((user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    }, []);

    const handleCreate = useCallback(() => {
        setSelectedUser(null);
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        setSelectedUser(null);
        refetch();
    }, [refetch]);

    // ---
    // Derived Stats for Cards (Optional, uncomment if desired)
    // ---
    const totalUsers = users?.length || 0;
    const adminUsers = users?.filter(user => user.role === 'admin').length || 0;
    const verifiedUsers = users?.filter(user => user.is_verified).length || 0;
    const totalPoints = users?.reduce((acc, user) => acc + (user.points || 0), 0) || 0;

    const statConfigs = [
        {
            title: "Total Users",
            value: totalUsers.toLocaleString(),
            icon: UsersIcon,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Admin Users",
            value: adminUsers.toLocaleString(),
            icon: Crown,
            color: "from-orange-500 to-orange-600",
        },
        {
            title: "Verified",
            value: verifiedUsers.toLocaleString(),
            icon: Shield,
            color: "from-emerald-500 to-emerald-600",
        },
        {
            title: "Total Points",
            value: totalPoints.toLocaleString(),
            icon: TrendingUp,
            color: "from-purple-500 to-purple-600",
        },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-screen space-y-4">
                    <motion.div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [-8, 8, -8] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-4 h-4 bg-blue-500 rounded-full"
                            />
                        ))}
                    </motion.div>
                    <p className="text-white text-lg font-medium">Loading user data...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-screen text-red-400 p-6">
                    <CircleAlert className="w-16 h-16 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Error Loading Users</h2>
                    <p className="text-gray-400 text-center max-w-md">{error.message || "Failed to fetch user data. Please try again later."}</p>
                    <Button onClick={refetch} className="mt-6 bg-blue-600 hover:bg-blue-700">
                        <RefreshCcw className="w-4 h-4 mr-2" /> Retry
                    </Button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">User Management</h1>
                            <p className="text-gray-400 mt-1">Manage users, roles, and permissions within your application.</p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleCreate}
                                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 py-2 px-4 rounded-md"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create User
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statConfigs.map((config, index) => (
                        <StatCard key={config.title} {...config} delay={index * 0.1} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="max-w-lg"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search users by email, username, or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-900/70 border-gray-800/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/25 rounded-lg transition-colors backdrop-blur-sm"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Card className="bg-gray-900/70 border border-gray-800/50 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white">Users List</CardTitle>
                            <p className="text-sm text-gray-400">A detailed list of all registered users in your system.</p>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-800/50 bg-gray-800/20">
                                            {["Email", "Username", "Full Name", "Role", "Verified", "Points", "Posts", "Created", "Actions"].map((header) => (
                                                <TableHead key={header} className="text-gray-300 font-semibold text-sm py-3 px-4">
                                                    {header}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence mode="wait">
                                            {paginatedUsers.length > 0 ? (
                                                paginatedUsers.map((user) => (
                                                    <motion.tr
                                                        key={user.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                                                    >
                                                        <TableCell className="text-white font-medium text-sm px-4 py-3">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                                <span>{user.email}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-300 text-sm px-4 py-3">{user.username || 'N/A'}</TableCell>
                                                        <TableCell className="text-gray-300 text-sm px-4 py-3">{user.full_name || 'N/A'}</TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <Badge
                                                                className={`${user.role === "admin"
                                                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0"
                                                                        : "bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0"
                                                                    } min-w-[70px] justify-center flex items-center gap-1`}
                                                            >
                                                                {user.role === "admin" && <Crown className="w-3 h-3" />}
                                                                {user.role}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <Badge
                                                                className={`${user.is_verified
                                                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0"
                                                                        : "bg-gradient-to-r from-red-500 to-red-600 text-white border-0"
                                                                    } min-w-[80px] justify-center flex items-center gap-1`}
                                                            >
                                                                {user.is_verified && <Shield className="w-3 h-3" />}
                                                                {user.is_verified ? "Verified" : "Pending"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-white font-medium text-sm px-4 py-3">
                                                            <div className="flex items-center space-x-1">
                                                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                                                <span>{user.points || 0}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-300 text-sm px-4 py-3">{user.post_count || 0}</TableCell>
                                                        <TableCell className="text-gray-300 text-sm px-4 py-3">
                                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <div className="flex space-x-2">
                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleEdit(user)}
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-md p-2"
                                                                        aria-label="Edit user"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                </motion.div>
                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => confirmDelete(user.id)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white shadow-md rounded-md p-2"
                                                                        aria-label="Delete user"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </motion.div>
                                                            </div>
                                                        </TableCell>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <CircleAlert className="w-10 h-10 mb-3 text-gray-500" />
                                                            <p className="text-lg font-medium">No users found.</p>
                                                            {searchTerm && (
                                                                <p className="text-sm mt-1">
                                                                    Your search for "{searchTerm}" did not yield any results. Try a different term.
                                                                </p>
                                                            )}
                                                            {!searchTerm && !loading && (
                                                                <p className="text-sm mt-1">
                                                                    Click "Create User" to add a new user to the system.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </AnimatePresence>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="flex justify-center items-center space-x-3 mt-6"
                    >
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 px-4 py-2"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>
                        <span className="flex items-center text-gray-300 text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 px-4 py-2"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                )}

                <UserModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    user={selectedUser}
                />

                <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsConfirmDialogOpen(false)}
                                className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}