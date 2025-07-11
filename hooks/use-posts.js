"use client";

import { useState, useEffect, useCallback } from "react";
import { postsService } from "@/lib/supabase/posts";
import { useSession } from "next-auth/react";

export function usePosts() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [initialLoading, setInitialLoading] = useState(false);
  const limit = 10;

  const fetchPosts = useCallback(
    async (currentOffset = 0, append = false) => {
      if (!userId) return;

      if (currentOffset === 0 && !append) {
        setInitialLoading(true);
      }

      try {
        setLoading(true);

        const res = await fetch(
          `/api/posts?offset=${currentOffset}&limit=${limit}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Gagal mengambil data post");
        }

        const newPosts = data || [];

        setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
        setHasMore(newPosts.length === limit);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userId) {
      fetchPosts(0, false);
    }
  }, [fetchPosts, userId]);

  const loadMorePosts = useCallback(() => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchPosts(nextOffset, true);
  }, [offset, fetchPosts]);

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
    loadMorePosts,
    initialLoading
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
