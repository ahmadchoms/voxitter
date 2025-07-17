import { supabase } from "./client";

export const likesService = {
  async createLike(postId, userId) {
    try {
      const { data: likeData, error: insertError } = await supabase
        .from("likes")
        .insert([{ post_id: postId, user_id: userId }])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      await supabase
        .from("posts")
        .update({
          likes_count: supabase.rpc("recalculate_likes_count", {
            p_post_id: postId,
          }),
        })
        .eq("id", postId);

      await supabase.rpc("update_user_points_by_post", { p_post_id: postId });

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
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("id", likeId);

      if (deleteError) throw new Error(deleteError.message);

      await supabase
        .from("posts")
        .update({
          likes_count: supabase.rpc("recalculate_likes_count", {
            p_post_id: postId,
          }),
        })
        .eq("id", postId);

      await supabase.rpc("update_user_points_by_post", { p_post_id: postId });

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
            created_at,
            user_id,
            likes_count,
            comments_count,
            user:users!posts_user_id_fkey (
              id,
              username,
              full_name,
              avatar_url,
              is_verified,
              points
            ),
            category:categories!posts_category_id_fkey (
              id,
              name,
              color,
              slug
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
          ?.map(({ post, created_at, id: like_id }) => ({
            ...post,
            is_liked: true,
            like_id: like_id,
            liked_at: created_at,
            user: post.user,
            category: post.category,
          })) || [];

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
