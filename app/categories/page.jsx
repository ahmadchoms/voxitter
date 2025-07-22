"use client";

import { useState, useMemo } from "react";
import { Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MainLayout } from "@/layouts/main-layout";
import Loading from "@/components/fragments/loading";
import { ErrorMessage } from "@/components/fragments/error-message";
import { useCategories } from "@/hooks/use-categories";
import { usePosts } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import Feed from "@/components/posts/feed";

export default function CategoriesPage() {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const { categories: allCategories, error: categoriesError, loading: categoriesLoading } = useCategories();
    const {
        posts,
        loading: postsLoading,
        error: postsError,
        loadMorePosts,
        hasMore,
        initialLoading,
    } = usePosts();

    const totalPosts = useMemo(() => {
        if (!allCategories) return 0;
        return allCategories.reduce((sum, cat) => sum + cat.post_count, 0);
    }, [allCategories]);

    const getCategoryIcon = (categoryName) => {
        const icons = {
            "Politik": "🏛️",
            "Ekonomi": "💰",
            "Hukum": "⚖️",
            "Teknologi": "🚀",
            "Kesehatan": "🏥",
            "Pendidikan": "📚",
            "Lingkungan": "🌿",
            "Sosial": "👥",
            "Budaya dan Agama": "🕉️",
            "Digitalisasi dan Privasi": "🔒",
            "Energi dan SDA": "⚡",
            "Infrastruktur": "🏗️",
            "Ketahanan Pangan": "🌾",
            "Pemerintahan dan Birokrasi": "🏢",
            "Pertahanan dan Keamanan": "🛡️",
            "Transportasi": "🚗"
        };
        return icons[categoryName] || "📌";
    };

    const categoriesWithColors = useMemo(() => {
        if (!allCategories) return [];
        const colors = [
            '#3B82F6',
            '#8B5CF6',
            '#10B981',
            '#F59E0B',
            '#EC4899',
            '#EF4444',
            '#06B6D4',
            '#F97316',
            '#F59E0B',
        ];

        return allCategories.map((category, index) => ({
            ...category,
            color: colors[index % colors.length]
        }));
    }, [allCategories]);

    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        if (selectedCategory === 'Semua') return posts;
        return posts.filter((post) =>
            post.categories?.some((cat) => cat.name === selectedCategory)
        );
    }, [posts, selectedCategory]);

    if (initialLoading || categoriesLoading) return <Loading />;
    if (categoriesError || postsError) return <ErrorMessage message={categoriesError || postsError} />;

    return (
        <MainLayout>
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Layers className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl inline-flex font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                        Categories
                        <Sparkles className="ml-1 size-5 text-purple-500" />
                    </h1>
                </div>

                <p className="text-gray-400 text-lg">Jelajahi postingan berdasarkan kategori</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: 0,
                            ease: [0.25, 0.4, 0.25, 1],
                        }}
                        whileHover={{
                            scale: 1.01,
                            transition: { duration: 0.2 },
                        }}
                    >
                        <Button
                            variant="link"
                            onClick={() => setSelectedCategory('Semua')}
                            className={`justify-start h-auto p-4 rounded-2xl transition-all duration-300 border group w-full ${selectedCategory === 'Semua'
                                ? 'bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/25'
                                : 'hover:bg-gray-700/40 border-transparent hover:border-gray-600/50'
                                }`}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <span className="text-lg">🌐</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="max-w-40 truncate font-semibold text-white text-sm leading-tight group-hover:text-blue-300 transition-colors duration-300">
                                            Semua
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                                {totalPosts.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-gray-500">(100%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                            style={{ width: "100%" }}
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{
                                                duration: 1.2,
                                                ease: [0.25, 0.4, 0.25, 1],
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </motion.div>

                    {categoriesWithColors.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: (index + 1) * 0.08,
                                ease: [0.25, 0.4, 0.25, 1],
                            }}
                            whileHover={{
                                scale: 1.01,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <Button
                                variant="link"
                                onClick={() => setSelectedCategory(category.name)}
                                className={`justify-start h-auto p-4 rounded-2xl transition-all duration-300 border group w-full ${selectedCategory === category.name
                                    ? 'bg-gray-600/20 border-gray-500/50 shadow-lg'
                                    : 'hover:bg-gray-700/40 border-transparent hover:border-gray-600/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <span className="text-lg">{getCategoryIcon(category.name)}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="max-w-40 truncate font-semibold text-white text-sm leading-tight group-hover:text-blue-300 transition-colors duration-300">
                                                {category.name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">
                                                    {category.post_count.toLocaleString()}
                                                </span>
                                                {totalPosts > 0 ? (
                                                    <span className="text-xs text-gray-500">
                                                        ({((category.post_count / totalPosts) * 100).toFixed(1)}%)
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-500">(0%)</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <div className="border-t border-gray-800/50 pt-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {selectedCategory === 'Semua' ? 'Semua Postingan' : `Postingan ${selectedCategory}`}
                    </h2>

                    {postsLoading && filteredPosts.length === 0 ? (
                        <Loading />
                    ) : filteredPosts && filteredPosts.length > 0 ? (
                        <div className="space-y-6">
                            {filteredPosts.map((post) => (
                                <Feed key={post.id} post={post} />
                            ))}

                            {hasMore && (
                                <div className="flex justify-center pt-6">
                                    <Button
                                        onClick={loadMorePosts}
                                        disabled={postsLoading}
                                        variant="outline"
                                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                    >
                                        {postsLoading ? 'Loading...' : 'Load More'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl">
                            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                                <Layers className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Postingan</h3>
                            <p className="text-gray-400">
                                {selectedCategory === 'Semua'
                                    ? 'Belum ada postingan tersedia. Mulai diskusi pertama!'
                                    : `Belum ada postingan untuk kategori ${selectedCategory}. Buat postingan pertama!`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}