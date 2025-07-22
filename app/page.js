"use client";

import CategoryPanel from "@/components/fragments/categories-panel";
import { ErrorMessage } from "@/components/fragments/error-message";
import Feed from "@/components/posts/feed";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/use-posts";
import { MainLayout } from "@/layouts/main-layout";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Home() {
  const {
    posts,
    loading,
    error,
    refreshPosts,
    loadMorePosts,
    hasMore,
    initialLoading,
  } = usePosts();
  console.log("posts", posts);

  if (error) return <ErrorMessage message={error} onRetry={refreshPosts} />;

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {posts?.map((post) => (
              <Feed key={post.id} post={post} />
            ))}
            {!initialLoading && hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="text-black font-semibold"
                  onClick={loadMorePosts}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    "Muat lebih banyak"
                  )}
                </Button>
              </div>
            )}
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
