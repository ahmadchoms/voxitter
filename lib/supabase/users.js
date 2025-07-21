import { supabase } from "./client";

export const usersService = {
  async getUsers(offset = 0, limit = 25) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash("voxitter_user", 10)

      const newUser = {
        ...userData,
        password: hashedPassword,
        role: "author",
        avatar_url: null,
        bio: null,
        is_verified: false,
        points: 0,
        post_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("users")
        .insert([newUser])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async updateUser(id, userData) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .maybeSingle();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Username sudah digunakan");
        }
        throw new Error(error.message || "Gagal memperbarui profil");
      }
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async deleteUser(id) {
    try {
      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async searchUsers(searchTerm, offset = 0, limit = 25) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .order("points", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getLeaderboardUsers(limit = 10) {
    try {
      const { data, error } = await supabase
        .rpc("get_leaderboard_users")
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getUserStats(userId) {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("post_count, points")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async updateUserPoints(userId, points) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ points })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async verifyUser(userId) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ is_verified: true })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getUserProfile(username, userId) {
    try {
      const { error: updateError } = await supabase.rpc(
        "update_user_points_by_user_id",
        { p_user_id: userId }
      );

      if (updateError) throw updateError;

      const { data, error } = await supabase.rpc("get_user_profile_data", {
        p_username: username,
      });

      if (error) throw error;

      const result = data[0];

      const user = result.user_data;
      const postsData = result.posts_data || [];
      const categories = result.categories_data || [];
      const most_contribution = result.most_contribution || null;

      const posts =
        postsData?.map((post) => ({
          ...post,
          is_liked:
            post.likes?.some((like) => like.user_id === userId) || false,
          is_bookmarked:
            post.bookmarks?.some((bm) => bm.user_id === userId) || false,
          likes: undefined,
          bookmarks: undefined,
        })) || [];

      return {
        data: { user, posts, categories, most_contribution },
        error: null,
      };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
