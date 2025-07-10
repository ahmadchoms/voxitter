import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Heart, Bookmark } from "lucide-react";
import Feed from "../posts/feed";

export function ProfileTabs({
    activeTab,
    setActiveTab,
    posts,
    bookmarkedPosts,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
        >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-700">
                    <TabsTrigger
                        value="posts"
                        className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
                    >
                        <FileText className="w-4 h-4" />
                        Postingan
                    </TabsTrigger>
                    <TabsTrigger
                        value="likes"
                        className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
                    >
                        <Heart className="w-4 h-4" />
                        Disukai
                    </TabsTrigger>
                    <TabsTrigger
                        value="bookmarks"
                        className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
                    >
                        <Bookmark className="w-4 h-4" />
                        Disimpan
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4 mt-6">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Feed post={post} />
                        </motion.div>
                    ))}
                </TabsContent>

                <TabsContent value="likes" className="space-y-4 mt-6">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Feed post={post} />
                        </motion.div>
                    ))}
                </TabsContent>

                {/* <TabsContent value="likes" className="mt-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">
                Belum ada postingan yang disukai
              </h3>
              <p className="text-gray-400">
                Postingan yang Anda sukai akan muncul di sini
              </p>
            </CardContent>
          </Card>
        </TabsContent> */}

                <TabsContent value="bookmarks" className="space-y-4 mt-6">
                    {bookmarkedPosts.length > 0 ? (
                        bookmarkedPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Feed post={post} />
                            </motion.div>
                        ))
                    ) : (
                        <Card className="bg-gray-900 border-gray-700">
                            <CardContent className="p-8 text-center">
                                <Bookmark className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                <h3 className="font-semibold mb-2 text-white">
                                    Belum ada postingan yang disimpan
                                </h3>
                                <p className="text-gray-400">
                                    Konten yang Anda bookmark akan muncul di sini
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
