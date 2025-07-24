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
        role: "author",
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
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: "",
            username: "",
            full_name: "",
            role: "author",
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
                role: user.role || "author",
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
                role: "author",
                is_verified: false,
                points: 0,
            }
            reset(defaultData)
            setFormData({
                role: "author",
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
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />
                    <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-md w-full p-0 border-0 bg-transparent">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-gray-900/95 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <DialogHeader className="p-6 border-b border-gray-800/50">
                                <DialogTitle className="flex items-center space-x-3 text-xl font-semibold text-white">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <User className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <span>{isEdit ? "Edit User" : "Create New User"}</span>
                                </DialogTitle>
                                <p className="text-sm text-gray-400 mt-2">
                                    {isEdit ? "Update user information and settings" : "Add a new user to the system"}
                                </p>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-blue-400" />
                                        <span>Email Address</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        {...register("email")}
                                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/25 rounded-lg transition-colors"
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center space-x-1 text-red-400 text-sm"
                                        >
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.email.message}</span>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                        <User className="h-4 w-4 text-emerald-400" />
                                        <span>Username</span>
                                    </Label>
                                    <Input
                                        {...register("username")}
                                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-emerald-500/50 focus:ring-emerald-500/25 rounded-lg transition-colors"
                                        placeholder="Enter username"
                                    />
                                    {errors.username && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center space-x-1 text-red-400 text-sm"
                                        >
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.username.message}</span>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                        <User className="h-4 w-4 text-purple-400" />
                                        <span>Full Name</span>
                                    </Label>
                                    <Input
                                        {...register("full_name")}
                                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-purple-500/25 rounded-lg transition-colors"
                                        placeholder="Enter full name"
                                    />
                                    {errors.full_name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center space-x-1 text-red-400 text-sm"
                                        >
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.full_name.message}</span>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                            <Crown className="h-4 w-4 text-orange-400" />
                                            <span>Role</span>
                                        </Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(value) => {
                                                setFormData(prev => ({ ...prev, role: value }))
                                                setValue("role", value)
                                            }}
                                        >
                                            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-orange-500/50 focus:ring-orange-500/25 rounded-lg">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700 text-white rounded-lg">
                                                <SelectItem value="author" className="focus:bg-gray-700 rounded-md">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4" />
                                                        <span>Author</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="admin" className="focus:bg-gray-700 rounded-md">
                                                    <div className="flex items-center space-x-2">
                                                        <Crown className="h-4 w-4 text-orange-400" />
                                                        <span>Admin</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                            <Sparkles className="h-4 w-4 text-yellow-400" />
                                            <span>Points</span>
                                        </Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.points}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value) || 0
                                                setFormData(prev => ({ ...prev, points: value }))
                                                setValue("points", value)
                                            }}
                                            className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-yellow-500/50 focus:ring-yellow-500/25 rounded-lg transition-colors"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                                            <Shield className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-white">Email Verification</Label>
                                            <p className="text-xs text-gray-400">Mark user as verified</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={formData.is_verified}
                                        onCheckedChange={(checked) => {
                                            setFormData(prev => ({ ...prev, is_verified: checked }))
                                            setValue("is_verified", checked)
                                        }}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800/50">
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        variant="outline"
                                        className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 rounded-lg transition-all duration-200"
                                    >
                                        {loading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}