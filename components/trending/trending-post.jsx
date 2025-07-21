"use client";

import { useState } from "react";
import { Clock, Star, Brain } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTrendingTopics } from "@/hooks/use-trending";
import StarRating from "./star-rating";

const TrendingPost = ({ topic, index, userId }) => {
    const { data: session } = useSession();
    const { rateTopic } = useTrendingTopics(userId);
    const [isRatingLoading, setIsRatingLoading] = useState(false);

    const getCategoryColor = (category) => {
        const colors = {
            'Politik': 'bg-blue-500/20 text-blue-400 border-blue-400/30',
            'Teknologi': 'bg-purple-500/20 text-purple-400 border-purple-400/30',
            'Lingkungan': 'bg-green-500/20 text-green-400 border-green-400/30',
            'Ekonomi': 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
            'Sosial': 'bg-pink-500/20 text-pink-400 border-pink-400/30',
            'Hukum': 'bg-red-500/20 text-red-400 border-red-400/30',
            'Pendidikan': 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30',
            'Kesehatan': 'bg-orange-500/20 text-orange-400 border-orange-400/30',
            'Energi dan SDA': 'bg-amber-500/20 text-amber-400 border-amber-400/30',
        };
        return colors[category] || 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Baru saja';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}j`;
        return `${Math.floor(diffInMinutes / (24 * 60))}h`;
    };

    const handleRate = async (newRating) => {
        setIsRatingLoading(true);
        const { success, error } = await rateTopic(topic.id, newRating);

        if (success) {
            toast.success("Rating submitted successfully!");
        } else {
            toast.error("Failed to submit rating" + (error ? `: ${error}` : ""));
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:bg-gray-900/70 transition-all duration-300 hover:border-gray-700/50 group overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-300 font-medium">Trending News</span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(topic.category)}`}>
                                {topic.category}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(topic.generated_at)}</span>
                            {topic.total_ratings > 0 && (
                                <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span>{topic.average_rating ? topic.average_rating.toFixed(1) : '0.0'}</span>
                                    </div>
                                    <span>({topic.total_ratings} ratings)</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-gray-400 text-sm font-mono">
                    #{index + 1}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-3 leading-relaxed group-hover:text-blue-300 transition-colors duration-200">
                    {topic.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                    {topic.description}
                </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                <div className="flex items-center gap-4">
                    <StarRating
                        rating={parseFloat(topic.average_rating)}
                        userRating={topic.userRating}
                        onRate={(newRating) => handleRate(topic.id, newRating)}
                        size={20}
                        disabled={!session}
                    />
                    {isRatingLoading && (
                        <span className="text-sm text-gray-500 animate-pulse">Submitting rating...</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendingPost;