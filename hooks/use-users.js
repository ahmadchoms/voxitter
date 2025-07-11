"use client";

import { useState, useEffect, useCallback } from "react";
import { usersService } from "@/lib/supabase/users";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await usersService.getUsers();

      if (result.error) {
        throw new Error(result.error);
      }

      setUsers(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}

export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const result = await usersService.getUserById(userId);

      if (result.error) {
        throw new Error(result.error);
      }

      setUser(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [fetchUser, userId]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

export function useUserSearch(searchTerm) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUsers = useCallback(async () => {
    if (!searchTerm || searchTerm.length < 2) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const result = await usersService.searchUsers(searchTerm);

      if (result.error) {
        throw new Error(result.error);
      }

      setUsers(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchUsers]);

  return {
    users,
    loading,
    error,
  };
}

export function useTopUsers(limit = 10) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await usersService.getTopUsers(limit);

      if (result.error) {
        throw new Error(result.error);
      }

      setUsers(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTopUsers();
  }, [fetchTopUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchTopUsers,
  };
}
