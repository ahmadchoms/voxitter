"use client";

import { useState, useEffect, useCallback } from "react";

export function usePostsByBookmark(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedPosts = useCallback(
    async (append = false) => {
      if (!userId) return;

      try {
        setLoading(true);

        const result = await fetch(`/api/posts/${userId}/bookmark`);

        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(
            errorData.error || "Failed to fetch bookmarked posts"
          );
        }

        const data = await result.json();
        const newPosts = data || [];

        setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
        setError(null);
      } catch (err) {
        console.error("Error fetching bookmarked posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userId) {
      fetchBookmarkedPosts(false);
    }
  }, [fetchBookmarkedPosts, userId]);

  return {
    posts,
    loading,
    error,
  };
}
