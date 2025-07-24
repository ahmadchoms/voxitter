"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCcw, CircleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/layouts/admin-layout";
import { useTrendingTopics } from "@/hooks/use-trending";

export default function TrendingAdminPage() {
    const { allTopics, isLoading, error, refreshTopics } = useTrendingTopics();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const itemsPerPage = 10;

    const filteredTopics = useMemo(() => {
        if (!allTopics) return [];
        return allTopics.filter(
            (topic) =>
                topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                topic.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                topic.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allTopics, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTopics = filteredTopics.slice(startIndex, startIndex + itemsPerPage);

    const handleGenerateTopics = async () => {
        if (isGenerating) return;

        setIsGenerating(true);
        toast.info("Generating new trending topics...", { duration: 3000 });

        try {
            const res = await fetch("/api/ai/trending/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "An unexpected error occurred during generation.");
            }

            const result = await res.json();
            toast.success("Topics generated successfully!", {
                description: result.message || "The list has been updated with new trending topics.",
            });

            refreshTopics();
        } catch (error) {
            console.error("Failed to generate topics:", error);
            toast.error("Generation Failed", {
                description: error.message,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"
                    ></motion.div>
                    <p className="ml-4 text-white text-lg">Loading trending topics...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-64 text-red-400">
                    <CircleAlert className="w-12 h-12 mb-4" />
                    <h2 className="text-xl font-semibold">Error Loading Topics</h2>
                    <p className="text-gray-400 text-center mt-2">{error.message || "Failed to fetch trending topics. Please try again later."}</p>
                    <Button onClick={refreshTopics} className="mt-4 bg-blue-600 hover:bg-blue-700">
                        <RefreshCcw className="w-4 h-4 mr-2" /> Retry
                    </Button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Trending Topics</h1>
                        <p className="text-gray-400">Manage and generate trending topics and categories for your platform.</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={handleGenerateTopics}
                            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg shadow-purple-500/25 transition-all duration-200 py-2 px-4 rounded-md"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <RefreshCcw className="w-4 h-4 mr-2" /> Generate New Topics
                                </>
                            )}
                        </Button>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    <div className="relative max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search topics by title, category, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-900/70 border-gray-800/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/25 rounded-lg transition-colors backdrop-blur-sm"
                        />
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                    <Card className="bg-gray-900/70 border border-gray-800/50 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-800/50 bg-gray-800/20">
                                            {["Title", "Category", "Description"].map((header) => (
                                                <TableHead key={header} className="text-gray-300 font-semibold text-sm py-3 px-4">
                                                    {header}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence mode="wait">
                                            {paginatedTopics.length > 0 ? (
                                                paginatedTopics.map((topic) => (
                                                    <motion.tr
                                                        key={topic.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                                                    >
                                                        <TableCell className="text-white font-medium px-4 py-3">{topic.title}</TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <Badge className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm hover:from-emerald-700 hover:to-teal-800 transition-colors">
                                                                {topic.category}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-gray-300 max-w-sm sm:max-w-md truncate px-4 py-3" title={topic.description}>
                                                            {topic.description}
                                                        </TableCell>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <CircleAlert className="w-10 h-10 mb-3 text-gray-500" />
                                                            <p className="text-lg font-medium">No trending topics found.</p>
                                                            {searchTerm && (
                                                                <p className="text-sm mt-1">
                                                                    Your search for "{searchTerm}" did not yield any results. Try a different term.
                                                                </p>
                                                            )}
                                                            {!searchTerm && !isLoading && (
                                                                <p className="text-sm mt-1">
                                                                    Click "Generate New Topics" to populate the list.
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
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex justify-center items-center space-x-3 mt-6"
                    >
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 px-4 py-2"
                        >
                            Previous
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
                            Next
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </AdminLayout>
    );
}