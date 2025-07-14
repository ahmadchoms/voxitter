"use client";

import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { BadgeCheck, Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "framer-motion"
import { Separator } from "../ui/separator";
import { FeedButton } from "./button-feed";
import CommentDialog from "./comment-dialog";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Feed({ post }) {
    const { data: session } = useSession()
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [likesCount, setLikesCount] = useState(post?.likes_count || 0)

    if (!post || !post.user) {
        return (
            <Card className="bg-gray-900 border-gray-800 animate-pulse">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-700 rounded w-24"></div>
                            <div className="h-3 bg-gray-700 rounded w-32"></div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const handleLike = async () => {
        try {
            const method = isLiked ? "DELETE" : "POST"
            const response = await fetch(`/api/posts/${post.id}/like`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: session.user.id }),
            })

            if (response.ok) {
                setIsLiked(!isLiked)
                setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
            }
        } catch (error) {
            console.error("Error toggling like:", error)
        }
    }

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Baru saja"
        if (diffInHours < 24) return `${diffInHours}j`
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}h`
        return date.toLocaleDateString("id-ID")
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
        >
            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="border-2 border-gray-700">
                                <AvatarFallback className="bg-gray-800 text-gray-200">
                                    {post.user.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h3 className="font-semibold text-white">
                                        {post.user.full_name}
                                    </h3>
                                    {post.user.is_verified && (
                                        <BadgeCheck
                                            className="w-5 h-5 text-white"
                                            fill="blue"
                                            stroke="white"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>{post.user.username}</span>
                                    <span>•</span>
                                    <span>{formatDate(post.created_at)}</span>
                                    <span>•</span>
                                    <Badge
                                        variant="outline"
                                        className="text-xs border-gray-700 text-gray-400"
                                    >
                                        {post.user.points.toLocaleString()} poin
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-3">
                        <Badge
                            variant="secondary"
                            className="mb-2 bg-gray-800 text-gray-200 border-gray-700"
                        >
                            {post.category && post.category.name}
                        </Badge>
                        <p className="text-gray-200 leading-relaxed">{post.content}</p>
                    </div>
                </CardContent>

                <Separator className="bg-gray-800" />

                <CardFooter className="pt-3">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-6">
                            <FeedButton
                                icon={Heart}
                                count={likesCount}
                                isActive={post.is_liked}
                                activeColor="text-red-500"
                                hoverColor="text-red-400"
                                onClick={handleLike}
                            />

                            <CommentDialog
                                post={post}
                                currentUserId={session?.user?.id}
                                trigger={
                                    <FeedButton
                                        icon={MessageCircle}
                                        count={post.comments_count}
                                        isActive={false}
                                        activeColor="text-blue-500"
                                        hoverColor="text-blue-400"
                                    />
                                }
                            />

                            <FeedButton
                                icon={Send}
                                isActive={false}
                                activeColor="text-green-500"
                                hoverColor="text-green-400"
                            />
                        </div>

                        <div className="flex items-center">
                            <motion.button
                                onClick={handleBookmark}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-800/50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Bookmark
                                        className={`w-5 h-5 transition-colors duration-200 ${post.is_bookmarked
                                                ? "text-white fill-current"
                                                : "text-gray-400 hover:text-gray-400"
                                            }`}
                                    />
                                </motion.div>
                            </motion.button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
