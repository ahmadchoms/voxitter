"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Sparkles } from "lucide-react";
import { MainLayout } from "@/layouts/main-layout";
import Loading from "@/components/fragments/loading";
import { ErrorMessage } from "@/components/fragments/error-message";
import { useTrendingTopics } from "@/hooks/use-trending";
import { useCategories } from "@/hooks/use-categories";
import TrendingPost from "@/components/trending/trending-post";
import { useSession } from "next-auth/react";

export default function TrendingPage() {
    const { data: session } = useSession();
    const { allTopics, isLoading: topicsLoading, error: topicsError } = useTrendingTopics(session?.user?.id);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const { categories: allCategories, error: categoriesError, loading: categoriesLoading } = useCategories();

    const categories = useMemo(() => {
        const uniqueCategories = new Set();
        allCategories?.forEach(cat => uniqueCategories.add(cat.name));
        return ['Semua', ...Array.from(uniqueCategories)].filter(Boolean);
    }, [allCategories]);

    const sortedTopics = useMemo(() => {
        if (!allTopics) return [];
        return [...allTopics].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    }, [allTopics]);

    const filteredTopics = useMemo(() => {
        return selectedCategory === 'Semua'
            ? sortedTopics
            : sortedTopics?.filter(topic => topic.category === selectedCategory);
    }, [selectedCategory, sortedTopics]);

    if (topicsLoading || categoriesLoading) return <Loading />;
    if (topicsError || categoriesError) return <ErrorMessage message={topicsError || categoriesError} />;

    return (
        <MainLayout>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl inline-flex font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                        Trending Topics By AI
                        <Sparkles className="ml-1 size-5 text-orange-500" />
                    </h1>
                </div>
                <p className="text-gray-400 text-lg">Berita dan topik yang sedang populer saat ini</p>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700/50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredTopics && filteredTopics.length > 0 ? (
                    <div className="space-y-6">
                        {filteredTopics.map((topic, index) => (
                            <TrendingPost key={topic.id} topic={topic} index={index} userId={session?.user?.id} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl">
                        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                            <TrendingUp className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Topik Trending</h3>
                        <p className="text-gray-400">Tidak ada topik trending untuk kategori ini. Coba buat yang baru!</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}