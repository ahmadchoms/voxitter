import { supabase } from "./client";

export const postsService = {
  async getPosts(offset = 0, limit = 25) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:users!posts_user_id_fkey(
            id,
            username,
            full_name,
            avatar_url,
            is_verified,
            points
          ),
          category:categories!posts_category_id_fkey(
            id,
            name,
            color,
            slug
          ),
          is_liked:likes!left(user_id),
          is_bookmarked:bookmarks!left(user_id)
        `
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const processedData =
        data?.map((post) => ({
          ...post,
          is_liked: post.is_liked?.length > 0,
          is_bookmarked: post.is_bookmarked?.length > 0,
          created_at: new Date(post.created_at).toLocaleDateString("id-ID"),
        })) || [];

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getPostById(id) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:users!posts_user_id_fkey(
            id,
            username,
            full_name,
            avatar_url,
            is_verified,
            points
          ),
          category:categories!posts_category_id_fkey(
            id,
            name,
            color,
            slug
          ),
          is_liked:likes!left(user_id),
          is_bookmarked:bookmarks!left(user_id)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      const processedData = {
        ...data,
        is_liked: data.is_liked?.length > 0,
        is_bookmarked: data.is_bookmarked?.length > 0,
        created_at: new Date(data.created_at).toLocaleDateString("id-ID"),
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

  async updatePost(id, postData) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async deletePost(id) {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);

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
            id,
            username,
            full_name,
            avatar_url,
            is_verified,
            points
          ),
          category:categories!posts_category_id_fkey(
            id,
            name,
            color,
            slug
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const processedData =
        data?.map((post) => ({
          ...post,
          created_at: new Date(post.created_at).toLocaleDateString("id-ID"),
        })) || [];

      return { data: processedData, error: null };
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
            id,
            username,
            full_name,
            avatar_url,
            is_verified,
            points
          ),
          category:categories!posts_category_id_fkey(
            id,
            name,
            color,
            slug
          )
        `
        )
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const processedData =
        data?.map((post) => ({
          ...post,
          created_at: new Date(post.created_at).toLocaleDateString("id-ID"),
        })) || [];

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async toggleLike(postId, userId) {
    try {
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (existingLike) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);

        if (error) throw error;
        return { data: { liked: false }, error: null };
      } else {
        const { error } = await supabase
          .from("likes")
          .insert([{ post_id: postId, user_id: userId }]);

        if (error) throw error;
        return { data: { liked: true }, error: null };
      }
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async toggleBookmark(postId, userId) {
    try {
      const { data: existingBookmark } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (existingBookmark) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);

        if (error) throw error;
        return { data: { bookmarked: false }, error: null };
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert([{ post_id: postId, user_id: userId }]);

        if (error) throw error;
        return { data: { bookmarked: true }, error: null };
      }
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getBookmarkedPosts(userId, offset = 0, limit = 25) {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select(
          `
          post:posts(
            *,
            user:users!posts_user_id_fkey(
              id,
              username,
              full_name,
              avatar_url,
              is_verified,
              points
            ),
            category:categories!posts_category_id_fkey(
              id,
              name,
              color,
              slug
            )
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const processedData =
        data?.map((bookmark) => ({
          ...bookmark.post,
          created_at: new Date(bookmark.post.created_at).toLocaleDateString(
            "id-ID"
          ),
        })) || [];

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
