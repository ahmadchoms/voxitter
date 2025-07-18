import React from "react";
import { BadgeCheck, Calendar, Star, Users, MapPin, Link2, Edit3, Trophy, TrendingUp, Activity } from "lucide-react";
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
    userId,
    most_contribution,
    badges,
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

                        {userId === user.id && (
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

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            {user.points >= 5000 && (
                                <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-300 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg shadow-yellow-500/20">
                                    <Trophy className="w-4 h-4 inline mr-2" />
                                    High Achiever
                                </div>
                            )}
                            {user.is_verified && (
                                <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg shadow-blue-500/20">
                                    <BadgeCheck className="w-4 h-4 inline mr-2" />
                                    Verified User
                                </div>
                            )}
                        </div>

                        {badges.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {badges.map((badge, index) => (
                                    <div
                                        key={index}
                                        className={`
                                                relative px-4 py-2 rounded-full text-sm font-semibold
                                                ${badge.backgroundColor} ${badge.textColor}
                                                border ${badge.borderColor}
                                                shadow-lg ${badge.glow}
                                                backdrop-blur-sm
                                                transition-all duration-300 
                                                hover:scale-105 hover:shadow-xl
                                                transform hover:-translate-y-0.5
                                                group cursor-pointer
                                            `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg group-hover:animate-pulse">
                                                {badge.emoji}
                                            </span>
                                            <span className="font-bold tracking-wide">
                                                {badge.name}
                                            </span>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-around items-center py-4 bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-2xl backdrop-blur-sm border border-gray-700/50 shadow-lg">
                        <div className="text-center space-y-2 group cursor-pointer">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                                {user.post_count}
                            </div>
                            <div className="text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                                Postingan
                            </div>
                        </div>

                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

                        <div className="text-center space-y-2 group cursor-pointer">
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-emerald-300 transition-all duration-300">
                                {user.points.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                                Poin
                            </div>
                        </div>

                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

                        <div className="text-center space-y-2 group cursor-pointer">
                            <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:to-rose-300 transition-all duration-300">
                                {most_contribution || "-"}
                            </div>
                            <div className="text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                                Kontribusi Terbanyak
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};