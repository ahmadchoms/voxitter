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
      if (
        !commentData.post_id ||
        !commentData.user_id ||
        !commentData.content
      ) {
        throw new Error("Post ID, User ID, and content are required");
      }

      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: commentData.post_id,
            user_id: commentData.user_id,
            content: commentData.content.trim(),
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

      const { data: updateData, error: updateError } = await supabase.rpc(
        "update_comment_count_rpc",
        {
          input_post_id: commentData.post_id,
        }
      );

      if (updateError) {
        console.error("Gagal update comments_count:", updateError);
      } else {
        console.log("comments_count berhasil diupdate!");
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error in createComment:", error);
      return { data: null, error: error.message };
    }
  },

  async deleteComment(commentId, userId, postId) {
    try {
      if (!commentId || !userId) {
        throw new Error("Comment ID and User ID are required");
      }

      const { error: fetchError } = await supabase
        .from("comments")
        .select("id, user_id")
        .eq("id", commentId)
        .eq("user_id", userId)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          throw new Error(
            "Comment not found or you don't have permission to delete it"
          );
        }
        throw fetchError;
      }

      const { error: deleteError } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      const { data: updateData, error: updateError } = await supabase.rpc(
        "update_comment_count_rpc",
        {
          input_post_id: postId,
        }
      );

      if (updateError) {
        console.error("Gagal update comments_count:", updateError);
      } else {
        console.log("comments_count berhasil diupdate!");
      }

      return { data: { success: true, id: commentId }, error: null };
    } catch (error) {
      console.error("Error in deleteComment:", error);
      return { data: null, error: error.message };
    }
  },
};
