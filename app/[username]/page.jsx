"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const username = params.username;
    const { data, loading, error } = usePublicProfile(username);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm ({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: "",
            username: "",
            bio: "",
        },
    });

    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (data?.user) {
            reset({
                full_name: data.user.full_name,
                username: data.user.username,
                bio: data.user.bio || "",
            });
        }
    }, [data, reset]);

    const onSubmit = async (data) => {
        setUpdateLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Pengguna Tidak Ditemukan</h2>
                    <p className="text-slate-400 mb-6">
                        Username &quot;{username}&quot; tidak ditemukan atau tidak tersedia.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button onClick={() => router.back()} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                        <Button
                            onClick={() => router.push("/leaderboard")}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Lihat Leaderboard
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-950 text-white flex overflow-hidden">
            <AppSidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-5 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <ProfileHeader
                            user={data.user}
                            isEditDialogOpen={isEditDialogOpen}
                            setIsEditDialogOpen={setIsEditDialogOpen}
                            register={register}
                            handleSubmit={handleSubmit}
                            errors={errors}
                            updateLoading={updateLoading}
                            onSubmit={onSubmit}
                            session={session?.user}
                        />
                        <ProfileTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            posts={data.posts}
                            bookmarkedPosts={bookmarkedPosts}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-12 flex justify-center gap-4"
                    >
                        <Link href="/leaderboard" className="px-4 py-2 rounded-md bg-background hover:bg-accent text-black font-medium">Lihat Leaderboard</Link>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
