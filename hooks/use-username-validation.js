"use client";

import { usersService } from "@/lib/supabase/users";
import { useCallback, useEffect, useState } from "react";

const useUsernameValidation = (form) => {
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);

    try {
      const result = await usersService.getUserByUsername(
        username.toLowerCase()
      );

      if (result.data) {
        setUsernameAvailable(false);
      } else if (result.error?.includes("single row")) {
        setUsernameAvailable(true);
      } else {
        setUsernameAvailable(null);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  }, []);

  useEffect(() => {
    const username = form.watch("username");

    if (!username || form.formState.errors.username) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(() => {
      checkUsernameAvailability(username);
    }, USERNAME_CHECK_DELAY);

    return () => clearTimeout(timer);
  }, [
    form.watch("username"),
    form.formState.errors.username,
    checkUsernameAvailability,
  ]);

  return { usernameAvailable, checkingUsername };
};

export default useUsernameValidation;