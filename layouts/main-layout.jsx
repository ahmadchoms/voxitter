"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/sidebar/sidebar";
import Loading from "@/components/fragments/loading";

export function MainLayout({ children }) {
    const { status } = useSession();

    if (status === "loading") return <Loading />

    return (
        <div className="h-screen bg-gray-950 text-white flex overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}
