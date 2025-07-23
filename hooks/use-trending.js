"use client";

import { useState, useEffect, useCallback } from "react";
import { trendingTopicsServices } from "@/lib/supabase/trending";

const calculateNewAverage = (topic, newRating) => {
  const currentTotal = topic.total_ratings;
  const currentAverage = topic.average_rating || 0;
  const oldUserRating = topic.user_rating || 0;

  if (currentTotal === 0) {
    return newRating.toFixed(1);
  }

  if (oldUserRating === 0) {
    return (
      (currentAverage * currentTotal + newRating) /
      (currentTotal + 1)
    ).toFixed(1);
  }

  return (
    (currentAverage * currentTotal - oldUserRating + newRating) /
    currentTotal
  ).toFixed(1);
};

export const useTrendingTopics = (userId) => {
  const [allTopics, setAllTopics] = useState([]);
  const [topTopics, setTopTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllTopics = useCallback(async () => {
    try {
      const { data, error: allError } =
        await trendingTopicsServices.getAllTrendingTopics(userId);
      if (allError) throw new Error(allError);
      setAllTopics(data);
    } catch (err) {
      console.error("Failed to fetch all trending topics:", err);
      setError(err.message);
    }
  }, [userId]);

  const fetchTopTopics = useCallback(async () => {
    try {
      const { data, error: topError } =
        await trendingTopicsServices.getTopTrendingTopics(userId);
      if (topError) throw new Error(topError);
      setTopTopics(data);
    } catch (err) {
      console.error("Failed to fetch top trending topics:", err);
      setError(err.message);
    }
  }, [userId]);

  const rateTopic = useCallback(
    async (topicId, newRating) => {
      try {
        if (!userId) {
          throw new Error("User not logged in to rate topic.");
        }

        const { error: rateError } = await trendingTopicsServices.rateTopic(
          topicId,
          userId,
          newRating
        );

        if (rateError) throw new Error(rateError);

        setAllTopics((prev) =>
          prev.map((topic) => {
            if (topic.id === topicId) {
              const updatedTotalRatings = topic.user_rating
                ? topic.total_ratings
                : topic.total_ratings + 1;
              const updatedAverageRating = calculateNewAverage(
                topic,
                newRating
              );

              return {
                ...topic,
                average_rating: parseFloat(updatedAverageRating),
                total_ratings: updatedTotalRatings,
                user_rating: newRating,
              };
            }
            return topic;
          })
        );

        setTopTopics((prev) =>
          prev.map((topic) => {
            if (topic.id === topicId) {
              const updatedTotalRatings = topic.user_rating
                ? topic.total_ratings
                : topic.total_ratings + 1;
              const updatedAverageRating = calculateNewAverage(
                topic,
                newRating
              );
              return {
                ...topic,
                average_rating: parseFloat(updatedAverageRating),
                total_ratings: updatedTotalRatings,
                user_rating: newRating,
              };
            }
            return topic;
          })
        );

        return { data: true };
      } catch (err) {
        console.error("Failed to rate topic:", err);
        setError(err.message);
        return { error: err.message };
      }
    },
    [userId]
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
