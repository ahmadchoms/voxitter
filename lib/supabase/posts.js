import { supabase } from "./client";

export const postsService = {
  async getPosts(offset = 0, limit = 25, viewerId) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:users!posts_user_id_fkey(
            id, username, full_name, avatar_url, is_verified, points
          ),
          post_categories(
            category:categories(
              id, name, color, slug
            )
          ),
          likes:likes!left(id, user_id, post_id),
          bookmarks:bookmarks!left(id, user_id, post_id)
          `
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const processedData =
        data?.map((post) => {
          const categories =
            post.post_categories?.map((pc) => pc.category) || [];

          return {
            ...post,
            categories: categories,
            is_liked:
              post.likes?.some((like) => like.user_id === viewerId) || false,
            is_bookmarked:
              post.bookmarks?.some((bm) => bm.user_id === viewerId) || false,
            post_categories: undefined,
            likes: undefined,
            bookmarks: undefined,
          };
        }) || [];

      return { data: processedData, error: null };
    } catch (error) {
      console.error("Error fetching posts in getPosts:", error);
      return { data: null, error: error.message };
    }
  },

  async getAllPosts() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching all posts:", error);
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

  async createPost({ user_id, content, category_ids, image_urls }) {
    try {
      const { data: postId, error } = await supabase.rpc("create_post", {
        p_user_id: user_id,
        p_content: content,
        p_image_urls: image_urls,
        p_category_ids: category_ids,
      });

      if (error) throw error;

      return { data: { id: postId }, error: null };
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

  async getPostsByCategory(categoryId, offset = 0, limit = 25, viewerId) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
                *,
                user:users!posts_user_id_fkey(
                    id, username, full_name, avatar_url, is_verified, points
                ),
                post_categories!inner(  -- Gunakan !inner untuk memastikan hanya post dengan kategori ini
                    category:categories(
                        id, name, color, slug
                    )
                ),
                likes:likes!left(id, user_id, post_id),
                bookmarks:bookmarks!left(id, user_id, post_id)
                `
        )
        .eq("post_categories.category_id", categoryId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const processedData =
        data?.map((post) => {
          const categories =
            post.post_categories?.map((pc) => pc.category) || [];
          return {
            ...post,
            categories: categories,
            is_liked:
              post.likes?.some((like) => like.user_id === viewerId) || false,
            is_bookmarked:
              post.bookmarks?.some((bm) => bm.user_id === viewerId) || false,
            post_categories: undefined,
            likes: undefined,
            bookmarks: undefined,
          };
        }) || [];

      return { data: processedData, error: null };
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      return { data: null, error: error.message };
    }
  },

  async getPostsByUser(userId, offset = 0, limit = 25, viewerId) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
                *,
                user:users!posts_user_id_fkey(
                    id, username, full_name, avatar_url, is_verified, points
                ),
                post_categories(
                    category:categories(
                        id, name, color, slug
                    )
                ),
                likes:likes!left(id, user_id, post_id),
                bookmarks:bookmarks!left(id, user_id, post_id)
                `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const processedData =
        data?.map((post) => {
          const categories =
            post.post_categories?.map((pc) => pc.category) || [];
          return {
            ...post,
            categories: categories,
            is_liked:
              post.likes?.some((like) => like.user_id === viewerId) || false,
            is_bookmarked:
              post.bookmarks?.some((bm) => bm.user_id === viewerId) || false,
            post_categories: undefined,
            likes: undefined,
            bookmarks: undefined,
          };
        }) || [];

      return { data: processedData, error: null };
    } catch (error) {
      console.error("Error fetching posts by user:", error);
      return { data: null, error: error.message };
    }
  },
};
