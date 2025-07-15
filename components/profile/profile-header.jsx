import React from "react";
import { BadgeCheck, Calendar, Star, Users, MapPin, Link2, Edit3, Trophy, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EditProfileDialog } from "./edit-profile-dialog";

export const ProfileHeader = ({
    user,
    isEditDialogOpen,
    setIsEditDialogOpen,
    register,
    handleSubmit,
    errors,
    updateLoading,
    onSubmit,
    session,
}) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
        });
    };

    return (
        <div className="overflow-hidden bg-gray-900 border border-slate-800 hover:border-gray-700 p-8 transition-all duration-200 rounded-3xl shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                <div className="flex-shrink-0">
                    <Avatar className="w-36 h-36 ring-4 ring-gray-600/50 shadow-2xl">
                        <AvatarImage
                            src={user.avatar_url || "/placeholder.svg"}
                            alt={user.full_name}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                            {user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-1 flex-wrap">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    {user.full_name}
                                </h1>
                                {user.is_verified && (
                                    <BadgeCheck
                                        className="size-6 text-white"
                                        fill="blue"
                                        stroke="white"
                                    />
                                )}
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                                    @{user.username}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>Bergabung sejak {formatDate(user.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {session.id === user.id && (
                            <EditProfileDialog
                                user={user}
                                isEditDialogOpen={isEditDialogOpen}
                                setIsEditDialogOpen={setIsEditDialogOpen}
                                register={register}
                                handleSubmit={handleSubmit}
                                errors={errors}
                                updateLoading={updateLoading}
                                onSubmit={onSubmit}
                            />
                        )}
                    </div>

                    <div className="space-y-3">
                        <p className="text-gray-300 leading-relaxed max-w-2xl">
                            {user.bio || "Belum ada bio yang ditambahkan."}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        {user.points >= 5000 && (
                            <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-full text-xs font-medium">
                                High Achiever
                            </div>
                        )}
                        {user.is_verified && (
                            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-medium">
                                Verified User
                            </div>
                        )}
                    </div>

                    <div className="flex justify-around items-center py-2 bg-gray-800/70 rounded-2xl backdrop-blur-sm">
                        <div className="text-center space-y-2">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {user.posts_count}
                            </div>
                            <div className="text-sm text-gray-400 font-medium">Postingan</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                {user.points.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400 font-medium">Poin</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                Pendidikan
                            </div>
                            <div className="text-sm text-gray-400 font-medium">Kontribusi Terbanyak</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};