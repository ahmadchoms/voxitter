"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import { BadgeCheck, Send, Trash2, Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useComments } from "@/hooks/use-comments";
import { toast } from "sonner";

function CommentItem({ comment, currentUserId, refreshComments }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: currentUserId, posts_id: comment.post_id }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete comment");
            }

            toast.success("Komentar berhasil dihapus");
            refreshComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error(error.message || "Gagal menghapus komentar");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
        >
            <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-800 text-gray-200 text-xs">
                    {comment.user.username
                        ? comment.user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium text-white text-sm">
                            {comment.user.username}
                        </span>
                        {comment.user.is_verified && (
                            <BadgeCheck
                                className="w-4 h-4 text-white"
                                fill="blue"
                                stroke="white"
                            />
                        )}
                        <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString("id-ID")}
                        </span>
                    </div>
                    {comment.user.id === currentUserId && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-red-400 p-1 h-auto"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Trash2 className="w-3 h-3" />
                            )}
                        </Button>
                    )}
                </div>
                <p className="text-gray-200 text-sm mb-2">{comment.content}</p>
            </div>
        </motion.div>
    );
}

function CommentsSection({ postId, currentUserId }) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { comments, loading, error, refreshComments } = useComments(postId);

    const handleSubmitComment = async () => {
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment.trim() }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to add comment");
            }

            toast.success("Komentar berhasil ditambahkan");
            setNewComment("");
            refreshComments();
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error(error.message || "Gagal menambahkan komentar");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <h3 className="font-semibold text-white">Komentar</h3>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="size-10 animate-spin text-blue-500" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <h3 className="font-semibold text-white">Komentar</h3>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-400">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-800">
                <h3 className="font-semibold text-white">
                    Komentar ({comments.length})
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[32.5rem]">
                {comments.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        Belum ada komentar
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            refreshComments={refreshComments}
                        />
                    ))
                )}
            </div>

            <div className="p-4 border-t border-gray-800">
                <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-800 text-gray-200 text-xs">
                            You
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2 max-w-full">
                        <Textarea
                            placeholder="Tulis komentar..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={isSubmitting}
                            className="h-auto min-h-[40px] max-h-[15rem] overflow-y-auto resize-none bg-gray-800 border-gray-700 text-white placeholder-gray-400 disabled:opacity-50"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmitComment();
                                }
                            }}
                        />
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CommentDialog({ post, trigger, currentUserId }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const DialogComponent = isMobile ? Drawer : Dialog;
    const TriggerComponent = isMobile ? DrawerTrigger : DialogTrigger;
    const ContentComponent = isMobile ? DrawerContent : DialogContent;

    return (
        <DialogComponent>
            <TriggerComponent asChild>{trigger}</TriggerComponent>
            <ContentComponent
                className={
                    isMobile
                        ? "h-[90vh] bg-gray-900 border-gray-800"
                        : "max-w-4xl w-full h-[80vh] p-0 bg-gray-900 border-gray-800"
                }
            >
                {!isMobile && (
                    <DialogHeader className="sr-only">
                        <DialogTitle>Komentar Post</DialogTitle>
                    </DialogHeader>
                )}
                {isMobile && (
                    <DrawerHeader>
                        <DrawerTitle className="text-white">Komentar</DrawerTitle>
                    </DrawerHeader>
                )}
                <div className="flex h-full">
                    <div className="flex-1">
                        <CommentsSection
                            postId={post.id}
                            currentUserId={currentUserId}
                        />
                    </div>
                </div>
            </ContentComponent>
        </DialogComponent>
    );
}