"use client";

import { useCallback, useEffect, useState } from "react";

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/posts/${postId}/comments`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal memuat komentar");
      }

      setComments(result || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const refreshComments = useCallback(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    hasMore,
    refreshComments,
  };
}
