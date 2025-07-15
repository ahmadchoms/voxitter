import { supabase } from "./client";

export const postsService = {
  async getPosts(offset = 0, limit = 25, userId) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:users!posts_user_id_fkey(
            id, username, full_name, avatar_url, is_verified, points
          ),
          category:categories!posts_category_id_fkey(
            id, name, color, slug
          ),
          likes:likes!left(user_id, post_id),
          bookmarks:bookmarks!left(user_id, post_id)
        `
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const processedData =
        data?.map((post) => ({
          ...post,
          is_liked:
            post.likes?.some((like) => like.user_id === userId) || false,
          is_bookmarked:
            post.bookmarks?.some((bm) => bm.user_id === userId) || false,
        })) || [];

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getPostById(id, userId) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:users!posts_user_id_fkey(
            id, username, full_name, avatar_url, is_verified, points
          ),
          category:categories!posts_category_id_fkey(
            id, name, color, slug
          ),
          likes:likes!left(user_id, post_id),
          bookmarks:bookmarks!left(user_id, post_id)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      const processedData = {
        ...data,
        is_liked: data.likes?.some((like) => like.user_id === userId) || false,
        is_bookmarked:
          data.bookmarks?.some((bm) => bm.user_id === userId) || false,
      };

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async createPost(postData) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([postData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async updatePost(id, postData, userId) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async deletePost(id, userId) {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getPostsByUser(userId, offset = 0, limit = 25) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:users!posts_user_id_fkey(
            id, username, full_name, avatar_url, is_verified, points
          ),
          category:categories!posts_category_id_fkey(
            id, name, color, slug
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getPostsByCategory(categoryId, offset = 0, limit = 25) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:users!posts_user_id_fkey(
            id, username, full_name, avatar_url, is_verified, points
          ),
          category:categories!posts_category_id_fkey(
            id, name, color, slug
          )
        `
        )
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
