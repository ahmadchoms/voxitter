"use client";

import CategoryPanel from "@/components/fragments/categories-panel";
import { ErrorMessage } from "@/components/fragments/error-message";
import Loading from "@/components/fragments/loading";
import Feed from "@/components/posts/feed";
import { usePosts } from "@/hooks/use-posts";
import { MainLayout } from "@/layouts/main-layout";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession()
  const { posts, loading, error, hasMore, refreshPosts } = usePosts();

  if (loading) return <Loading />

  if (error) return <ErrorMessage message={error} onRetry={refreshPosts} />

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {posts?.map((post) => (
              <Feed key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <CategoryPanel />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}