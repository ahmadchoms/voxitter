import { supabase } from "./client";

export const trendingTopicsServices = {
  async getAllTrendingTopics(userId) {
    try {
      const { data, error } = await supabase.rpc("get_all_trending_topics", {
        p_user_id: userId,
      });

      if (error) {
        throw new Error(
          `Failed to fetch all trending topics: ${error.message}`
        );
      }

      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: null,
        error: error.message || "An unexpected error occurred",
      };
    }
  },

  async getTopTrendingTopics(userId) {
    try {
      const { data, error } = await supabase.rpc("get_top_trending_topics", {
        p_user_id: userId,
      });

      if (error) {
        throw new Error(
          `Failed to fetch top trending topics: ${error.message}`
        );
      }

      return { data: data || [], error: null };
    } catch (error) {
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
        throw new Error(`Failed to save/update topic rating: ${error.message}`);
      }

      return { data: data[0] || null, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.message || "An unexpected error occurred",
      };
    }
  },
};
