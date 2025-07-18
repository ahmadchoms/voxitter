"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { MainLayout } from "@/layouts/main-layout";
import Loading from "@/components/fragments/loading";
import { PROFILE_FORM_DEFAULTS } from "@/lib/constants/form";
import { profileSchema } from "@/lib/validation/user";
import { useUserProfile } from "@/hooks/use-users";
import { toast } from "sonner";
import { getBadgeByCategory } from "@/lib/utils/badge";

export default function PublicProfilePage() {
    const { username } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const { profile, loading, error, refetch } = useUserProfile(username);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: PROFILE_FORM_DEFAULTS,
    });

    const badges = profile?.categories
        .map((category) =>
            getBadgeByCategory(category.category_slug, category.post_count)
        )
        .filter(Boolean);

    const [activeTab, setActiveTab] = useState("posts");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (profile?.user) {
            reset({
                full_name: profile.user.full_name,
                username: profile.user.username,
                bio: profile.user.bio || "",
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data) => {
        if (!session?.user?.id) {
            toast.error("Anda harus login untuk memperbarui profil.");
            return;
        }

        setUpdateLoading(true);
        try {
            const response = await fetch(`/api/users/${session.user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Gagal memperbarui profil");
            }

            const updatedProfile = await response.json();
            toast.success("Profil berhasil diperbarui!");

            refetch();
            setIsEditDialogOpen(false);
        } catch (error) {
            toast.error("Gagal memperbarui profil: " + (error.message || "Terjadi kesalahan"));
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error || !profile) {
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
        <MainLayout>
            <div className="p-5 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="space-y-8"
                >
                    <ProfileHeader
                        user={profile.user}
                        isEditDialogOpen={isEditDialogOpen}
                        setIsEditDialogOpen={setIsEditDialogOpen}
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        updateLoading={updateLoading}
                        onSubmit={onSubmit}
                        userId={session?.user?.id}
                        most_contribution={profile.most_contribution}
                        badges={badges}
                    />
                    <ProfileTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        posts={profile.posts}
                        userId={profile?.user?.id}
                        isOwner={session?.user?.id === profile.user.id}
                    />
                </motion.div>

            </div>
        </MainLayout>
    );
}
