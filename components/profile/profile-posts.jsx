import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Heart, Share, Bookmark } from "lucide-react";

export const PublicProfilePosts = ({
    posts,
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 px-4">Postingan Terbaru</h2>

            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-slate-400 text-lg">Belum ada postingan</div>
                </div>
            ) : (
                posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300"
                    >
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                                        {post.category}
                                    </span>
                                </div>
                                <span className="text-slate-400 text-sm">{post.timestamp}</span>
                            </div>

                            <p className="text-white text-lg leading-relaxed">
                                {post.content}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                            <div className="flex items-center gap-6">
                                <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
                                    <Heart className="w-5 h-5" />
                                    <span className="text-sm">{post.likes}</span>
                                </button>

                                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-sm">{post.comments}</span>
                                </button>

                                <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors">
                                    <Share className="w-5 h-5" />
                                    <span className="text-sm">{post.shares}</span>
                                </button>
                            </div>

                            <button className="text-slate-400 hover:text-yellow-400 transition-colors">
                                <Bookmark className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
};
