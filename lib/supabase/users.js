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

      const processedData =
        data?.map((user) => ({
          ...user,
          created_at: new Date(user.created_at).toLocaleDateString("id-ID"),
          updated_at: new Date(user.updated_at).toLocaleDateString("id-ID"),
        })) || [];

      return { data: processedData, error: null };
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

      const processedData = {
        ...data,
        created_at: new Date(data.created_at).toLocaleDateString("id-ID"),
        updated_at: new Date(data.updated_at).toLocaleDateString("id-ID"),
      };

      return { data: processedData, error: null };
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

      const processedData = {
        ...data,
        created_at: new Date(data.created_at).toLocaleDateString("id-ID"),
        updated_at: new Date(data.updated_at).toLocaleDateString("id-ID"),
      };

      return { data: processedData, error: null };
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

      const processedData = {
        ...data,
        created_at: new Date(data.created_at).toLocaleDateString("id-ID"),
        updated_at: new Date(data.updated_at).toLocaleDateString("id-ID"),
      };

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([userData])
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
        .select()
        .single();

      if (error) throw error;
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

      const processedData =
        data?.map((user) => ({
          ...user,
          created_at: new Date(user.created_at).toLocaleDateString("id-ID"),
          updated_at: new Date(user.updated_at).toLocaleDateString("id-ID"),
        })) || [];

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getTopUsers(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, full_name, avatar_url, points, is_verified")
        .order("points", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getUserStats(userId) {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("posts_count, points")
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
};
