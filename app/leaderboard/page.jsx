"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardPodium } from "@/components/leaderboard/leaderboard-podium";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import Loading from "@/components/fragments/loading";
import { ErrorMessage } from "@/components/fragments/error-message";
import { useLeaderboardUsers } from "@/hooks/use-users";

export default function LeaderboardPage() {
    const router = useRouter();
    const { users, loading, error } = useLeaderboardUsers();

    if (loading) return <Loading />;

    if (error) return <ErrorMessage message={error} />

    const topThree = users.slice(0, 3);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <LeaderboardHeader />

                {topThree.length > 0 && <LeaderboardPodium topThree={topThree} />}

                {users.length > 3 && <LeaderboardList users={users} />}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="mt-16 flex justify-center items-center"
                >
                    <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="text-black font-bold bg-gray-200"
                    >
                        Kembali
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
