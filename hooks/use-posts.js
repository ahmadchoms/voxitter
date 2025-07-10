"use client";

import { useState, useEffect, useCallback } from "react";
import { postsService } from "@/lib/supabase/posts";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchPosts = useCallback(async (currentOffset = 0, append = false) => {
    try {
      setLoading(true);
      const result = await postsService.getPosts(currentOffset, 25);

      if (result.error) {
        throw new Error(result.error);
      }

      const newPosts = result.data || [];

      if (newPosts.length < 25) {
        setHasMore(false);
      }

      setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(0, false);
  }, [fetchPosts]);

  useEffect(() => {
    if (!hasMore) return;

    const interval = setInterval(() => {
      const nextOffset = offset + 25;
      setOffset(nextOffset);
      fetchPosts(nextOffset, true);
    }, 5000);

    return () => clearInterval(interval);
  }, [offset, hasMore, fetchPosts]);

  const refreshPosts = useCallback(() => {
    setOffset(0);
    setHasMore(true);
    fetchPosts(0, false);
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    refreshPosts,
  };
}

export function usePostsByUser(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserPosts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await postsService.getPostsByUser(userId);

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
      fetchUserPosts();
    }
  }, [fetchUserPosts, userId]);

  return {
    posts,
    loading,
    error,
    refetch: fetchUserPosts,
  };
}

export function usePostsByCategory(categoryId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryPosts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await postsService.getPostsByCategory(categoryId);

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
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryPosts();
    }
  }, [fetchCategoryPosts, categoryId]);

  return {
    posts,
    loading,
    error,
    refetch: fetchCategoryPosts,
  };
}

export function useBookmarkedPosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedPosts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await postsService.getBookmarkedPosts(userId);

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
