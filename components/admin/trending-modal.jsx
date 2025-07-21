"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createTrending } from "@/lib/supabase/trending"

const trendingSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    category: z.string().min(2, "Category must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
})

export default function TrendingModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(trendingSchema),
        defaultValues: {
            title: "",
            category: "",
            description: "",
        },
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await createTrending(data)
            toast.success("Topic created successfully")
            reset()
            onClose()
        } catch (error) {
            toast.error("Failed to create topic")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Trending Topic</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} className="bg-gray-800 border-gray-700 text-white" />
                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" {...register("category")} className="bg-gray-800 border-gray-700 text-white" />
                        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            className="bg-gray-800 border-gray-700 text-white"
                            rows={4}
                        />
                        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-gray-700 text-gray-400 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
