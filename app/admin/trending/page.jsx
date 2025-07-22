"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/layouts/admin-layout"
import { useTrendingTopics } from "@/hooks/use-trending"

export default function TrendingAdminPage() {
    const {
        filteredTopics,
        searchTerm,
        setSearchTerm,
        loading,
        refetch
    } = useTrendingTopics()

    const [currentPage, setCurrentPage] = useState(1)
    const [isGenerating, setIsGenerating] = useState(false)
    const itemsPerPage = 15

    const handleGenerateTopics = async () => {
        if (isGenerating) return
        setIsGenerating(true)
        toast.info("Generating topics...")

        try {
            const res = await fetch("/api/ai/trending/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to generate topics.")
            }

            const result = await res.json()
            toast.success("Topics generated successfully!", {
                description: result.message,
            })

            await refetch()
            
        } catch (error) {
            toast.error("Generation Failed", {
                description: error.message,
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const totalPages = Math.ceil((filteredTopics?.length || 0) / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTopics = (filteredTopics || []).slice(startIndex, startIndex + itemsPerPage)

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Trending Topics</h1>
                        <p className="text-gray-400">Manage trending topics and categories</p>
                    </div>
                    <Button onClick={handleGenerateTopics} className="bg-blue-600 hover:bg-blue-700" disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <RefreshCcw className="w-4 h-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <RefreshCcw className="w-4 h-4" /> Generate New Topics
                            </>
                        )}
                    </Button>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-900 border-gray-700 text-white"
                    />
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-800">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800">
                                <TableHead className="text-gray-400">ID</TableHead>
                                <TableHead className="text-gray-400">Title</TableHead>
                                <TableHead className="text-gray-400">Category</TableHead>
                                <TableHead className="text-gray-400">Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTopics.map((topic) => (
                                <TableRow key={topic.id} className="border-gray-800">
                                    <TableCell className="text-white">{topic.id}</TableCell>
                                    <TableCell className="text-white font-medium">{topic.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{topic.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-300 max-w-md truncate">{topic.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border-gray-700 text-gray-400"
                        >
                            Previous
                        </Button>
                        <span className="flex items-center text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="border-gray-700 text-gray-400"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </motion.div>
        </AdminLayout>
    )
}
