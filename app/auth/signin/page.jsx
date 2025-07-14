"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LOADING_STATES } from "@/lib/constants/auth";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants/message";
import usePasswordToggle from "@/hooks/use-password-toggle";
import SignInView from "@/components/view/auth/signin";
import { SIGNIN_FORM_DEFAULTS } from "@/lib/constants/form";
import { signInSchema } from "@/lib/validation/auth";

export default function SignInPage() {
  const [loading, setLoading] = useState(null);
  const { showPassword, togglePassword } = usePasswordToggle();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: SIGNIN_FORM_DEFAULTS,
    mode: "onChange",
  });

  const handleGoogleSignIn = async () => {
    try {
      setLoading(LOADING_STATES.GOOGLE);

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error(ERROR_MESSAGES.GOOGLE_SIGNIN_FAILED);
      } else if (result?.ok) {
        toast.success(SUCCESS_MESSAGES.GOOGLE_SIGNIN);
        router.push("/");
      }
    } catch (error) {
      toast.error(ERROR_MESSAGES.GOOGLE_SIGNIN_ERROR);
    } finally {
      setLoading(null);
    }
  };

  const onSubmit = async (values) => {
    try {
      setLoading(LOADING_STATES.CREDENTIALS);

      const result = await signIn("credentials", {
        redirect: false,
        email: values.email.toLowerCase().trim(),
        password: values.password,
        callbackUrl: "/",
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error(ERROR_MESSAGES.CREDENTIAL_SIGNIN_FAILED);
        } else if (result.error === "AccessDenied") {
          toast.error(ERROR_MESSAGES.SIGNIN_ACCESS_DENIED);
        } else {
          toast.error(ERROR_MESSAGES.SIGNIN_GENERIC_ERROR);
        }
      } else if (result?.ok) {
        toast.success(SUCCESS_MESSAGES.SIGIN_SUCCESS);
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(ERROR_MESSAGES.SIGNIN_GENERIC_ERROR);
    } finally {
      setLoading(null);
    }
  };

  return (
    <SignInView
      form={form}
      loading={loading}
      showPassword={showPassword}
      togglePassword={togglePassword}
      handleGoogleSignIn={handleGoogleSignIn}
      onSubmit={onSubmit}
    />
  );
}
