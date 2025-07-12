import React from "react";
import { BadgeCheck, Calendar, Star, Users } from "lucide-react";
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
        <div className="bg-gray-900 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 ring-4 ring-gray-700 shadow-lg">
                        <AvatarImage
                            src={user.avatar_url || "/placeholder.svg"}
                            alt={user.full_name}
                        />
                        <AvatarFallback className="text-2xl bg-gray-800 text-gray-200">
                            {user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">
                                    {user.full_name}
                                </h1>
                                {user.is_verified && (
                                    <BadgeCheck
                                        className="w-5 h-5 text-white"
                                        fill="blue"
                                        stroke="white"
                                    />
                                )}
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

                            <div className="flex items-center gap-6">
                                <div className="px-3 py-1 w-fit bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                                    @{user.username}
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Bergabung sejak {formatDate("2023-01-15T00:00:00Z")}
                                    </span>
                                </div>
                            </div>

                            <div className="px-3">
                                <p className="text-sm leading-relaxed text-gray-300">
                                    {user.bio || "Belum ada bio"}
                                </p>
                            </div>

                            <div className="bg-yellow-500/40 flex items-center gap-2 border-[1.5px] border-yellow-700 rounded-2xl w-fit">
                                <div className="flex items-center gap-1 px-3 py-1 bg-slate-800/50 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm font-medium text-white">
                                        {user.points.toLocaleString()} poin
                                    </span>
                                </div>
                            </div>
                        </div>

                        {session !== user.id && (
                            <div className="flex gap-3">
                                <Button className="flex items-center gap-2 text-gray-300 bg-gray-600/50 hover:bg-gray-600 hover:text-white border-0">
                                    <Users className="w-4 h-4 mr-2" />
                                    Ikuti
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                                {user.posts_count}
                            </div>
                            <div className="text-sm text-slate-400">Postingan</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">2.1K</div>
                            <div className="text-sm text-slate-400">Pengikut</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">892</div>
                            <div className="text-sm text-slate-400">Mengikuti</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
