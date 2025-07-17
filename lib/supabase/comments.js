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

  async createComment(commentData) {
    try {
      const { post_id, user_id, content } = commentData;

      if (!post_id || !user_id || !content) {
        throw new Error("Post ID, User ID, and content are required");
      }

      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id,
            user_id,
            content: content.trim(),
            created_at: new Date().toISOString(),
          },
        ])
        .select(
          `
          *,
          user:users!comments_user_id_fkey(id, username, is_verified)
        `
        )
        .single();

      if (error) throw error;

      await updateCommentsCountAndPoints(post_id);

      return { data, error: null };
    } catch (error) {
      console.error("Error in createComment:", error);
      return { data: null, error: error.message };
    }
  },

  async deleteComment(commentId, userId, postId) {
    try {
      if (!commentId || !userId || !postId) {
        throw new Error("Comment ID, User ID, and Post ID are required");
      }

      const { error: deleteError, count } = await supabase
        .from("comments")
        .delete({ count: "exact" })
        .eq("id", commentId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;
      if (count === 0) {
        throw new Error("Comment not found or unauthorized.");
      }

      await updateCommentsCountAndPoints(postId);

      return { data: { success: true, id: commentId }, error: null };
    } catch (error) {
      console.error("Error in deleteComment:", error);
      return { data: null, error: error.message };
    }
  },
};

async function updateCommentsCountAndPoints(postId) {
  try {
    const { data: commentsCount, error: countError } = await supabase.rpc(
      "recalculate_comments_count",
      { p_post_id: postId }
    );
    if (countError) throw countError;

    const { error: updatePostError } = await supabase
      .from("posts")
      .update({ comments_count: commentsCount })
      .eq("id", postId);
    if (updatePostError) throw updatePostError;

    const { error: pointError } = await supabase.rpc(
      "update_user_points_by_post",
      { p_post_id: postId }
    );
    if (pointError) throw pointError;

    return { success: true };
  } catch (err) {
    console.error("updateCommentsCountAndPoints error:", err);
    return { success: false, error: err.message };
  }
}
