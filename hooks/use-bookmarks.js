"use client";

import { bookmarksService } from "@/lib/supabase/bookmarks";
import { useCallback, useEffect, useState } from "react";

export function useBookmarkedPosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedPosts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await bookmarksService.getBookmarkedPosts(userId);

      if (result.error) {
        throw new Error(result.error);
      }

      setPosts(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchBookmarkedPosts();
    }
  }, [fetchBookmarkedPosts, userId]);

  return {
    posts,
    loading,
    error,
    refetch: fetchBookmarkedPosts,
  };
}
