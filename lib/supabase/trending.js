import { supabase } from "./client";

export const trendingTopicsServices = {
  async getAllTrendingTopics() {
    try {
      const { data, error } = await supabase.rpc("get_all_trending_topics");

      if (error) {
        console.error("Error fetching all trending topics:", error);
        throw new Error(
          `Failed to fetch all trending topics: ${error.message}`
        );
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Unexpected error in getAllTrendingTopics:", error);
      return {
        data: null,
        error: error.message || "An unexpected error occurred",
      };
    }
  },

  async getTopTrendingTopics() {
    try {
      const { data, error } = await supabase.rpc("get_top_trending_topics");

      if (error) {
        console.error("Error fetching top trending topics:", error);
        throw new Error(
          `Failed to fetch top trending topics: ${error.message}`
        );
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Unexpected error in getTopTrendindTopics:", error);
      return {
        data: null,
        error: error.message || "An unexpected error occurred",
      };
    }
  },

  async rateTopic(topicId, userId, rating) {
    try {
      if (!topicId || !userId || !rating) {
        throw new Error(
          "Invalid parameters: topicId, userId, and rating are required."
        );
      }

      const { data, error } = await supabase
        .from("topic_ratings")
        .upsert(
          { user_id: userId, topic_id: topicId, rating: rating },
          { onConflict: "user_id, topic_id" }
        )
        .select();

      if (error) {
        console.error("Supabase Error saving/updating topic rating:", error);
        throw new Error(`Failed to save/update topic rating: ${error.message}`);
      }

      return { data: data[0] || null, error: null };
    } catch (error) {
      console.error("Unexpected error in rateTopic:", error);
      return {
        data: null,
        error: error.message || "An unexpected error occurred",
      };
    }
  },
};
