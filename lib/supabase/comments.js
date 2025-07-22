import { supabase } from "./client";

export const commentsService = {
  async getCommentsByPost(postId, offset = 0, limit = 25) {
    try {
      if (!postId) throw new Error("Post ID is required");

      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          *,
          user:users!comments_user_id_fkey(id, username, is_verified)
        `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error in getCommentsByPost:", error);
      return { data: null, error: error.message };
    }
  },

  async createComment({ post_id, user_id, content }) {
    try {
      if (!post_id || !user_id || !content?.trim()) {
        throw new Error("Post ID, User ID, and content are required");
      }

      const { data, error } = await supabase.rpc("comment_post", {
        p_post_id: post_id,
        p_user_id: user_id,
        p_content: content,
      });

      if (error) throw error;

      const { data: enriched, error: enrichError } = await supabase
        .from("comments")
        .select(
          `
        *,
        user:users!comments_user_id_fkey(id, username, is_verified)
      `
        )
        .eq("id", data.id)
        .single();

      if (enrichError) throw enrichError;

      return { data: enriched, error: null };
    } catch (error) {
      console.error("Error in createComment:", error);
      return { data: null, error: error.message };
    }
  },

  async deleteComment(commentId, userId) {
    try {
      if (!commentId || !userId) {
        throw new Error("Comment ID and User ID are required");
      }

      const { error } = await supabase.rpc("uncomment_post", {
        p_comment_id: commentId,
      });

      if (error) throw error;

      return { data: { success: true, id: commentId }, error: null };
    } catch (error) {
      console.error("Error in deleteComment:", error);
      return { data: null, error: error.message };
    }
  },
};
