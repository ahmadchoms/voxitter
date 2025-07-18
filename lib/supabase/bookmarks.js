import { supabase } from "./client";

export const bookmarksService = {
  async createBookmark(postId, userId) {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .insert([{ post_id: postId, user_id: userId }])
        .select();

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteBookmark(bookmarkId) {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async findBookmark(postId, userId) {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getBookmarkedPosts(userId) {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select(
          `
          id,
          created_at,
          post:posts!bookmarks_post_id_fkey (
            id,
            content,
            image_urls,
            created_at,
            user_id,
            like_count,
            comment_count,
            user:users!posts_user_id_fkey (
              id,
              username,
              full_name,
              avatar_url,
              is_verified,
              points
            ),
            post_categories(
                    category:categories(
                        id, name, color, slug
                    )
                )
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const processedData =
        data
          ?.filter((item) => item.post)
          ?.map(({ post, created_at, id: bookmark_id }) => {
            const categories =
              post.post_categories?.map((pc) => pc.category) || [];

            return {
              ...post,
              categories: categories,
              is_bookmarked: true,
              bookmark_id: bookmark_id,
              bookmarked_at: created_at,
              post_categories: undefined,
            };
          }) || [];

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};