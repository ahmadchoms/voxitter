import { useState, useEffect, useCallback } from "react";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/categories");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch categories");
      }

      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
  };
}
