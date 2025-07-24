import { supabase } from "./client";

export const likesService = {
  async getCountLikes() {
    try {
      const { count, error } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      return { data: count, error: null };
    } catch (error) {
      console.error("Error in getCountLikes:", error);
      return { data: null, error: error.message };
    }
  },

  async createLike(postId, userId) {
    try {
      const { data: likeData, error } = await supabase.rpc("like_post", {
        p_post_id: postId,
        p_user_id: userId,
      });

      if (error) throw new Error(error.message);

      return {
        success: true,
        data: likeData,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteLike(likeId) {
    try {
      const { error } = await supabase.rpc("unlike_post", {
        p_like_id: likeId,
      });

      if (error) throw new Error(error.message);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async findLike(postId, userId) {
    try {
      const { data, error } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getLikedPosts(userId) {
    try {
      const { data, error } = await supabase
        .from("likes")
        .select(
          `
          id,
          created_at,
          post:posts!likes_post_id_fkey (
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

      if (error) throw new Error(error.message);

      const processedData =
        data
          ?.filter((item) => item.post)
          ?.map(({ post, created_at, id: like_id }) => {
            const categories =
              post.post_categories?.map((pc) => pc.category) || [];

            return {
              ...post,
              categories: categories,
              is_liked: true,
              like_id: like_id,
              liked_at: created_at,
              post_categories: undefined,
            };
          }) || [];

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
