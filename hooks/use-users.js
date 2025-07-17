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

export function useUsername(username) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsername = useCallback(async () => {
    if (!username) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/users/${username}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch user");
      }

      setUser(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchUsername();
    } else {
      setUser(null);
      setLoading(false);
      setError(null);
    }
  }, [username, fetchUsername]);

  return {
    user,
    loading,
    error,
    refetch: fetchUsername,
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

export function useLeaderboardUsers(limit = 10) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetch(`/api/leaderboard?limit=${limit}`);
      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.error || "Failed to fetch top users");
      }

      setUsers(data || []);
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

export function useUserProfile(username) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!username) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/users/${username}/profile`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch user profile");
      }

      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
      setError(null);
    }
  }, [username, fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}