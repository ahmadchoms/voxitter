import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Heart, Bookmark, Loader2 } from "lucide-react";
import Feed from "../posts/feed";
import { usePostsByLike } from "@/hooks/use-posts";
import { ErrorMessage } from "../fragments/error-message";
import Loading from "../fragments/loading";
import { usePostsByBookmark } from "@/hooks/use-bookmarks";

export function ProfileTabs({
    activeTab,
    setActiveTab,
    posts,
    userId,
    isOwner = false,
    refreshPosts
}) {
    const { posts: likedPosts, error: likeError, loading: likeLoading } = usePostsByLike(userId);
    const { posts: bookmarkPosts, error: bookmarkError, loading: bookmarkLoading } = usePostsByBookmark(userId);

    if (likeError || bookmarkError) return <ErrorMessage message={likeError || bookmarkError} />

    const gridCols = isOwner ? "grid-cols-3" : "grid-cols-1";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full"
        >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid w-full ${gridCols} bg-gray-900 border-gray-700 h-auto`}>
                    <TabsTrigger
                        value="posts"
                        className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4"
                    >
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">Postingan</span>
                    </TabsTrigger>
                    {isOwner && (
                        <>
                            <TabsTrigger
                                value="likes"
                                className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4"
                            >
                                <Heart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">Disukai</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="bookmarks"
                                className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4"
                            >
                                <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">Disimpan</span>
                            </TabsTrigger>
                        </>
                    )}
                </TabsList>

                <div className="mt-1 sm:mt-6">
                    <TabsContent
                        value="posts"
                        className="max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-250px)] overflow-y-auto pr-2 sm:pr-4 space-y-2 sm:space-y-4"
                    >
                        {posts && posts.length > 0 ? (
                            posts.map((post, index) => (
                                <Feed key={index} post={post} refreshPosts={refreshPosts} />
                            ))
                        ) : (
                            <Card className="bg-gray-900 border-gray-700">
                                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                                    <h3 className="font-semibold mb-1 sm:mb-2 text-white text-sm sm:text-base lg:text-lg">
                                        Belum ada postingan
                                    </h3>
                                    <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                                        Buat postingan pertama Anda!
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {isOwner && (
                        <>
                            <TabsContent
                                value="likes"
                                className="max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-250px)] overflow-y-auto pr-2 sm:pr-4"
                            >
                                {likeLoading && likedPosts.length === 0 ? (
                                    <div className="flex justify-center items-center py-8 sm:py-12">
                                        <Loading />
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {likedPosts.length > 0 ? (
                                            likedPosts.map((post, index) => (
                                                <motion.div
                                                    key={post.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                >
                                                    <Feed post={post} refreshPosts={refreshPosts} />
                                                </motion.div>
                                            ))
                                        ) : (
                                            <Card className="bg-gray-900 border-gray-700">
                                                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                                                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                                                    <h3 className="font-semibold mb-1 sm:mb-2 text-white text-sm sm:text-base lg:text-lg">
                                                        Belum ada postingan yang disukai
                                                    </h3>
                                                    <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                                                        Konten yang Anda suka akan muncul di sini
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent
                                value="bookmarks"
                                className="max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-250px)] overflow-y-auto pr-2 sm:pr-4"
                            >
                                {bookmarkLoading && bookmarkPosts.length === 0 ? (
                                    <div className="flex justify-center items-center py-8 sm:py-12">
                                        <Loading />
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {bookmarkPosts.length > 0 ? (
                                            bookmarkPosts.map((post, index) => (
                                                <motion.div
                                                    key={post.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                >
                                                    <Feed post={post} refreshPosts={refreshPosts} />
                                                </motion.div>
                                            ))
                                        ) : (
                                            <Card className="bg-gray-900 border-gray-700">
                                                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                                                    <Bookmark className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                                                    <h3 className="font-semibold mb-1 sm:mb-2 text-white text-sm sm:text-base lg:text-lg">
                                                        Belum ada postingan yang disimpan
                                                    </h3>
                                                    <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                                                        Konten yang Anda simpan akan muncul di sini
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                )}
                            </TabsContent>
                        </>
                    )}
                </div>
            </Tabs>
        </motion.div>
    );
}