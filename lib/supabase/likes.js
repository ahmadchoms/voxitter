import { supabase } from "./client";

export const likesService = {
  async toggleLike(postId, userId) {
    try {
      const { data: existingLike, error: fetchError } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error(`Error checking existing like: ${fetchError.message}`);
      }

      let isLiked;
      let actionSuccess = false;

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("id", existingLike.id);

        if (deleteError) {
          throw new Error(`Error unliking post: ${deleteError.message}`);
        }
        isLiked = false;
        actionSuccess = true;
      } else {
        const { data: newLike, error: insertError } = await supabase
          .from("likes")
          .insert([{ post_id: postId, user_id: userId }]);

        if (insertError) {
          throw new Error(`Error liking post: ${insertError.message}`);
        }
        isLiked = true;
        actionSuccess = true;
      }

      if (actionSuccess) {
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("likes_count")
          .eq("id", postId)
          .single();

        if (postError) {
          console.warn(
            `Could not fetch updated likes count for post ${postId}: ${postError.message}`
          );
          return {
            success: true,
            isLiked,
            newLikesCount: existingLike?.likes_count || 0,
          };
        } else {
          return {
            success: true,
            isLiked,
            newLikesCount: postData.likes_count,
          };
        }
      }

      return {
        success: false,
        isLiked: !isLiked,
        newLikesCount: 0,
        error: "Unknown error during like toggle.",
      };
    } catch (error) {
      console.error("Failed to toggle like:", error.message);
      return {
        success: false,
        isLiked: false,
        newLikesCount: 0,
        error: error.message,
      };
    }
  },

  async getLikesPosts(userId) {
    try {
      const { data, error } = await supabase
        .from("likes")
        .select(
          `
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

      if (error) throw error;

      const processedData =
        data
          ?.filter((item) => item.post)
          ?.map(({ post, created_at }) => ({
            ...post,
            is_liked: true,
            liked_at: created_at,
            user: post.user,
            category: post.category,
          })) || [];

      return { data: processedData, error: null };
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      return { data: null, error: error.message };
    }
  },
};
