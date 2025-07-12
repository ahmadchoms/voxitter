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
import { BadgeCheck, Heart, MessageCircle, Send, Share } from "lucide-react";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "../ui/avatar";

const mockComments = [
    {
        id: 1,
        author: {
            name: "Budi Santoso",
            username: "@budisantoso",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: false,
        },
        content:
            "Setuju sekali! Transparansi adalah kunci utama dalam implementasi kebijakan.",
        timestamp: "1 jam yang lalu",
        likes: 12,
    },
    {
        id: 2,
        author: {
            name: "Siti Nurhaliza",
            username: "@sitinur",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: true,
        },
        content:
            "UMKM memang perlu mendapat perhatian khusus. Semoga ada solusi konkret yang berpihak pada rakyat kecil.",
        timestamp: "45 menit yang lalu",
        likes: 8,
    },
    {
        id: 3,
        author: {
            name: "Ahmad Rahman",
            username: "@ahmadrahman",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: false,
        },
        content:
            "Bagus sekali pembahasannya. Kita sebagai warga negara juga harus ikut serta dalam mengawasi jalannya pemerintahan.",
        timestamp: "30 menit yang lalu",
        likes: 15,
    },
    {
        id: 4,
        author: {
            name: "Dewi Sartika",
            username: "@dewisartika",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: true,
        },
        content:
            "Semoga implementasinya bisa berjalan dengan baik dan tidak hanya jadi wacana belaka.",
        timestamp: "25 menit yang lalu",
        likes: 9,
    },
    {
        id: 5,
        author: {
            name: "Eko Prasetyo",
            username: "@ekoprasetyo",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: false,
        },
        content:
            "Perlu ada monitoring yang ketat dari masyarakat sipil untuk memastikan kebijakan ini benar-benar efektif.",
        timestamp: "20 menit yang lalu",
        likes: 7,
    },
    {
        id: 6,
        author: {
            name: "Lina Marlina",
            username: "@linam",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: false,
        },
        content:
            "Komentar yang sangat membangun, semoga pemerintah mendengarnya.",
        timestamp: "18 menit yang lalu",
        likes: 5,
    },
    {
        id: 7,
        author: {
            name: "Rahmat Hidayat",
            username: "@rahmath",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: true,
        },
        content:
            "Keterlibatan publik sangat penting dalam menjaga transparansi kebijakan.",
        timestamp: "15 menit yang lalu",
        likes: 13,
    },
    {
        id: 8,
        author: {
            name: "Nur Aisyah",
            username: "@aisyah_nur",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: false,
        },
        content:
            "Saya berharap ada forum publik rutin untuk membahas kebijakan seperti ini.",
        timestamp: "12 menit yang lalu",
        likes: 6,
    },
    {
        id: 9,
        author: {
            name: "Fajar Nugroho",
            username: "@fajarnug",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: true,
        },
        content:
            "Kolaborasi antara pemerintah dan masyarakat harus diperkuat lagi.",
        timestamp: "10 menit yang lalu",
        likes: 11,
    },
    {
        id: 10,
        author: {
            name: "Melati Putri",
            username: "@melatiputri",
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: false,
        },
        content:
            "Topik ini sangat relevan. Mari terus diskusikan dan beri masukan positif.",
        timestamp: "5 menit yang lalu",
        likes: 4,
    },
];



function CommentsSection({
    newComment,
    setNewComment,
}) {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-800">
                <h3 className="font-semibold text-white">Komentar</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[32.5rem]">
                {mockComments.map((comment) => (
                    <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-800 text-gray-200 text-xs">
                                {comment.author.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-1 mb-1">
                                <span className="font-medium text-white text-sm">
                                    {comment.author.full_name}
                                </span>
                                {comment.author.isVerified && (
                                    <BadgeCheck
                                        className="w-4 h-4 text-white"
                                        fill="blue"
                                        stroke="white"
                                    />
                                )}
                                <span className="text-xs text-gray-500">
                                    {comment.timestamp}
                                </span>
                            </div>
                            <p className="text-gray-200 text-sm mb-2">{comment.content}</p>
                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors">
                                <Heart className="w-3 h-3" />
                                <span>{comment.likes}</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
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
                            className="h-auto min-h-[40px] max-h-[15rem] overflow-y-auto resize-none bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DesktopDialog({
    trigger,
}) {
    const [newComment, setNewComment] = useState("");

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-gray-900 border-gray-800">
                <DialogHeader className="sr-only">
                    <DialogTitle>Komentar Post</DialogTitle>
                </DialogHeader>
                <div className="flex h-full">
                    <div className="flex-1">
                        <CommentsSection
                            newComment={newComment}
                            setNewComment={setNewComment}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MobileDrawer({
    post,
    trigger,
}) {
    const [newComment, setNewComment] = useState("");

    return (
        <Drawer>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent className="h-[90vh] bg-gray-900 border-gray-800">
                <DrawerHeader>
                    <DrawerTitle className="text-white">Komentar</DrawerTitle>
                </DrawerHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-10 h-10 border-2 border-gray-700">
                                <AvatarFallback className="bg-gray-800 text-gray-200">
                                    {post.user.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h3 className="font-semibold text-white text-sm">
                                        {post.user.full_name}
                                    </h3>
                                    {post.user.isVerified && (
                                        <BadgeCheck
                                            className="w-4 h-4 text-white"
                                            stroke="white"
                                            fill="blue"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span>{post.user.username}</span>
                                    <span>•</span>
                                    <span>{post.timestamp}</span>
                                </div>
                            </div>
                        </div>

                        <Badge
                            variant="secondary"
                            className="bg-gray-800 text-gray-200 mb-2"
                        >
                            {post.category}
                        </Badge>

                        <p className="text-gray-200 text-sm leading-relaxed mb-3">
                            {post.content}
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Heart className="w-4 h-4" />
                                <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.comments}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Share className="w-4 h-4" />
                                <span>{post.shares}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {mockComments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-gray-800 text-gray-200 text-xs">
                                        {comment.author.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white text-sm">
                                            {comment.author.full_name}
                                        </span>
                                        {comment.author.isVerified && (
                                            <BadgeCheck className="w-4 h-4 text-blue-500 fill-current" />
                                        )}
                                        <span className="text-xs text-gray-500">
                                            {comment.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-gray-200 text-sm mb-2">
                                        {comment.content}
                                    </p>
                                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors">
                                        <Heart className="w-3 h-3" />
                                        <span>{comment.likes}</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-800">
                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gray-800 text-gray-200 text-xs">
                                    You
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                                <Textarea
                                    placeholder="Tulis komentar..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[40px] bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none"
                                />
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default function CommentDialog({
    post,
    trigger,
}) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile) {
        return <MobileDrawer post={post} trigger={trigger} />;
    }

    return <DesktopDialog trigger={trigger} />;
}
