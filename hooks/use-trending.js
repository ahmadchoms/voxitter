import { useState, useEffect, useCallback } from "react";
import { trendingTopicsServices } from "@/lib/supabase/trending";

export const useTrendingTopics = ( userId ) => {
  const [allTopics, setAllTopics] = useState([]);
  const [topTopics, setTopTopics] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllTopics = useCallback(async () => {
    try {
      const { data, error: allError } =
        await trendingTopicsServices.getAllTrendingTopics();
      if (allError) throw new Error(allError);

      const enriched = data.map((topic) => ({
        ...topic,
        userRating: userRatings[topic.id] || 0,
      }));

      setAllTopics(enriched);
    } catch (err) {
      console.error("Failed to fetch all trending topics:", err);
      setError(err.message);
    }
  }, [userRatings]);

  const fetchTopTopics = useCallback(async () => {
    try {
      const { data, error: topError } =
        await trendingTopicsServices.getTopTrendingTopics();
      if (topError) throw new Error(topError);

      const enriched = data.map((topic) => ({
        ...topic,
        userRating: userRatings[topic.id] || 0,
      }));

      setTopTopics(enriched);
    } catch (err) {
      console.error("Failed to fetch top trending topics:", err);
      setError(err.message);
    }
  }, [userRatings]);

  const rateTopic = useCallback(
    async (topicId, newRating) => {
      try {
        const { data, error: rateError } =
          await trendingTopicsServices.rateTopic(topicId, userId, newRating);

        if (rateError) throw new Error(rateError);

        setUserRatings((prev) => ({
          ...prev,
          [topicId]: newRating,
        }));

        await fetchAllTopics();
        await fetchTopTopics();

        return { success: true, data };
      } catch (err) {
        console.error("Failed to rate topic:", err);
        setError(err.message);
        return { success: false, error: err.message };
      }
    },
    [userId, fetchAllTopics, fetchTopTopics]
  );

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchAllTopics(), fetchTopTopics()]);
      setIsLoading(false);
    };
    init();
  }, [fetchAllTopics, fetchTopTopics]);

  return {
    allTopics,
    topTopics,
    userRatings,
    isLoading,
    error,
    rateTopic,
    refreshTopics: async () => {
      setIsLoading(true);
      await Promise.all([fetchAllTopics(), fetchTopTopics()]);
      setIsLoading(false);
    },
  };
};
