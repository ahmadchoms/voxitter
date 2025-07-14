import { supabase } from "./client";

export const categoriesService = {
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
