import { supabase } from "./client";

export const categoriesService = {
  async getCategories() {
    try {
      const { data, error } = await supabase
        .rpc("get_all_categories")
        .order("name");

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
