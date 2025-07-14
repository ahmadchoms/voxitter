import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";

export function PostPreview({ user, avatar, content, categories, images }) {
    return (
        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 max-w-[29rem]">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="border-2 border-gray-700">
                            <AvatarImage src={avatar || ""} alt="User Avatar" />
                            <AvatarFallback className="bg-gray-800 text-gray-200">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-1">
                                <h3 className="font-semibold text-white">
                                    {user.name}
                                </h3>
                                {user.is_verified && (
                                    <BadgeCheck
                                        className="w-5 h-5 text-white"
                                        fill="blue"
                                        stroke="white"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>{user.username}</span>
                                <span>•</span>
                                <span>{new Date().toLocaleDateString('id-ID')}</span>
                                <span>•</span>
                                <Badge
                                    variant="outline"
                                    className="text-xs border-gray-700 text-gray-400"
                                >
                                    {user.points.toLocaleString()} poin
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
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {categories.map((category) => (
                                <Badge
                                    key={category.id}
                                    variant="secondary"
                                    className="text-xs text-white"
                                    style={{ backgroundColor: category.color }}
                                >
                                    {category.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <p className="text-gray-200 leading-relaxed break-words whitespace-pre-wrap">{content}</p>

                    {images.length > 0 && (
                        <div className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {images.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <Separator className="bg-gray-800" />

            <CardFooter className="pt-3">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1 text-gray-400">
                            <Heart className="w-5 h-5" /> <span>0</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <MessageCircle className="w-5 h-5" /> <span>0</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <Send className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200">
                            <Bookmark className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}