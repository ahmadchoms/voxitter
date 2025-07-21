"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usersService } from "@/lib/supabase/users"
import { User, Mail, Shield, Crown, Sparkles, Save, X, AlertCircle } from "lucide-react"

const userSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    role: z.enum(["user", "admin"]).default("user"),
    is_verified: z.boolean().default(false),
    points: z.number().min(0, "Points must be non-negative").default(0),
})

export default function UserModal({ isOpen, onClose, user }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        role: "user",
        is_verified: false,
        points: 0
    })
    const isEdit = !!user

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: "",
            username: "",
            full_name: "",
            role: "user",
            is_verified: false,
            points: 0,
        },
    })

    useEffect(() => {
        if (user) {
            const userData = {
                email: user.email || "",
                username: user.username || "",
                full_name: user.full_name || "",
                role: user.role || "user",
                is_verified: user.is_verified || false,
                points: user.points || 0,
            }
            reset(userData)
            setFormData({
                role: userData.role,
                is_verified: userData.is_verified,
                points: userData.points
            })
        } else {
            const defaultData = {
                email: "",
                username: "",
                full_name: "",
                role: "user",
                is_verified: false,
                points: 0,
            }
            reset(defaultData)
            setFormData({
                role: "user",
                is_verified: false,
                points: 0
            })
        }
    }, [user, reset])

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const submitData = { ...data, ...formData }
            if (isEdit) {
                await usersService.updateUser(user.id, submitData)
                toast.success("User updated successfully")
            } else {
                await usersService.createUser(submitData)
                toast.success("User created successfully")
            }
            onClose()
        } catch (error) {
            toast.error(isEdit ? "Failed to update user" : "Failed to create user")
        } finally {
            setLoading(false)
        }
    }

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-md w-full p-0 border-0 bg-transparent">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative"
                        >
                            {/* Background Effects */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900/90 to-cyan-900/20 rounded-2xl"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

                            <div className="relative bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
                                {/* Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="relative p-6 border-b border-gray-700/50"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
                                    <DialogHeader className="relative">
                                        <DialogTitle className="flex items-center space-x-3 text-xl font-bold">
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                className="relative"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-50"></div>
                                                <User className="relative h-6 w-6 text-purple-400" />
                                            </motion.div>
                                            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                                {isEdit ? "Edit User" : "Create New User"}
                                            </span>
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <Sparkles className="h-5 w-5 text-cyan-400" />
                                            </motion.div>
                                        </DialogTitle>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Shield className="h-4 w-4 text-purple-400" />
                                            <span className="text-sm text-purple-300">User Management Panel</span>
                                        </div>
                                    </DialogHeader>
                                </motion.div>

                                {/* Form */}
                                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                                    {/* Email Field */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="space-y-2"
                                    >
                                        <Label className="text-gray-300 font-medium flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-purple-400" />
                                            <span>Email Address</span>
                                        </Label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <Input
                                                type="email"
                                                {...register("email")}
                                                className="relative bg-gray-800/80 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-purple-500/25 rounded-xl transition-all duration-300"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                        {errors.email && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center space-x-1 text-red-400 text-sm"
                                            >
                                                <AlertCircle className="h-3 w-3" />
                                                <span>{errors.email.message}</span>
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* Username Field */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="space-y-2"
                                    >
                                        <Label className="text-gray-300 font-medium flex items-center space-x-2">
                                            <User className="h-4 w-4 text-cyan-400" />
                                            <span>Username</span>
                                        </Label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <Input
                                                {...register("username")}
                                                className="relative bg-gray-800/80 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/25 rounded-xl transition-all duration-300"
                                                placeholder="Enter username"
                                            />
                                        </div>
                                        {errors.username && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center space-x-1 text-red-400 text-sm"
                                            >
                                                <AlertCircle className="h-3 w-3" />
                                                <span>{errors.username.message}</span>
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* Full Name Field */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="space-y-2"
                                    >
                                        <Label className="text-gray-300 font-medium flex items-center space-x-2">
                                            <User className="h-4 w-4 text-emerald-400" />
                                            <span>Full Name</span>
                                        </Label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <Input
                                                {...register("full_name")}
                                                className="relative bg-gray-800/80 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-emerald-500/50 focus:ring-emerald-500/25 rounded-xl transition-all duration-300"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                        {errors.full_name && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center space-x-1 text-red-400 text-sm"
                                            >
                                                <AlertCircle className="h-3 w-3" />
                                                <span>{errors.full_name.message}</span>
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* Role & Verification Row */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        {/* Role Field */}
                                        <div className="space-y-2">
                                            <Label className="text-gray-300 font-medium flex items-center space-x-2">
                                                <Crown className="h-4 w-4 text-orange-400" />
                                                <span>Role</span>
                                            </Label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <Select
                                                    value={formData.role}
                                                    onValueChange={(value) => {
                                                        setFormData(prev => ({ ...prev, role: value }))
                                                        setValue("role", value)
                                                    }}
                                                >
                                                    <SelectTrigger className="relative bg-gray-800/80 backdrop-blur border-gray-600/50 text-white focus:border-orange-500/50 focus:ring-orange-500/25 rounded-xl">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                                        <SelectItem value="user" className="focus:bg-gray-700">
                                                            <div className="flex items-center space-x-2">
                                                                <User className="h-4 w-4" />
                                                                <span>User</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="admin" className="focus:bg-gray-700">
                                                            <div className="flex items-center space-x-2">
                                                                <Crown className="h-4 w-4 text-orange-400" />
                                                                <span>Admin</span>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Points Field */}
                                        <div className="space-y-2">
                                            <Label className="text-gray-300 font-medium flex items-center space-x-2">
                                                <Sparkles className="h-4 w-4 text-yellow-400" />
                                                <span>Points</span>
                                            </Label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={formData.points}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value) || 0
                                                        setFormData(prev => ({ ...prev, points: value }))
                                                        setValue("points", value)
                                                    }}
                                                    className="relative bg-gray-800/80 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-yellow-500/50 focus:ring-yellow-500/25 rounded-xl transition-all duration-300"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Verification Switch */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="space-y-3"
                                    >
                                        <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-600/50 group hover:border-gray-500/50 transition-all duration-300">
                                            <div className="flex items-center space-x-3">
                                                <motion.div
                                                    animate={formData.is_verified ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <Shield className={`h-5 w-5 ${formData.is_verified ? 'text-emerald-400' : 'text-gray-500'} transition-colors duration-300`} />
                                                </motion.div>
                                                <div>
                                                    <Label className="text-gray-300 font-medium">Email Verification</Label>
                                                    <p className="text-sm text-gray-400">Mark user as verified</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={formData.is_verified}
                                                onCheckedChange={(checked) => {
                                                    setFormData(prev => ({ ...prev, is_verified: checked }))
                                                    setValue("is_verified", checked)
                                                }}
                                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                        className="flex justify-end space-x-3 pt-4 border-t border-gray-700/50"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                type="button"
                                                onClick={onClose}
                                                className="group bg-gray-700/80 backdrop-blur border border-gray-600/50 text-gray-300 hover:bg-gray-600/80 hover:text-white rounded-xl transition-all duration-300"
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: 90 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                </motion.div>
                                                Cancel
                                            </Button>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-0 text-white shadow-lg shadow-purple-500/25 rounded-xl transition-all duration-300"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <motion.div
                                                    animate={loading ? { rotate: 360 } : { rotate: 0 }}
                                                    transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                </motion.div>
                                                {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                </form>
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}