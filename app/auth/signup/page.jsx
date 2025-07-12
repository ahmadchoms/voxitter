"use client";

import React, { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signUpSchema } from "@/lib/validation/users";
import { usersService } from "@/lib/supabase/users";
import usePasswordToggle from "@/hooks/use-password-toggle";
import useUsernameValidation from "@/hooks/use-username-validation";
import SignUpView from "@/components/view/auth/signup";
import { LOADING_STATES } from "@/lib/constants/auth";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants/message";
import { SIGNUP_FORM_DEFAULTS } from "@/lib/constants/form";

export default function SignUpPage() {
    const [loading, setLoading] = useState(LOADING_STATES.NONE);
    const router = useRouter();
    const { showPassword, showConfirmPassword, togglePassword, toggleConfirmPassword } = usePasswordToggle();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: SIGNUP_FORM_DEFAULTS,
        mode: "onChange",
    });

    const { usernameAvailable, checkingUsername } = useUsernameValidation(form);

    const handleGoogleSignUp = useCallback(async () => {
        try {
            setLoading(LOADING_STATES.GOOGLE);

            const result = await signIn("google", {
                redirect: false,
                callbackUrl: "/",
            });

            if (result?.error) {
                console.error("Google sign-up error:", result.error);
                toast.error(ERROR_MESSAGES.GOOGLE_SIGNUP_FAILED);
            } else if (result?.ok) {
                toast.success(SUCCESS_MESSAGES.GOOGLE_SIGNUP);
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            console.error("Google sign-up error:", error);
            toast.error(ERROR_MESSAGES.GOOGLE_SIGNUP_ERROR);
        } finally {
            setLoading(LOADING_STATES.NONE);
        }
    }, [router]);

    const checkExistingUser = useCallback(async (username, email) => {
        const [usernameCheck, emailCheck] = await Promise.all([
            usersService.getUserByUsername(username.toLowerCase()),
            usersService.getUserByEmail(email.toLowerCase()),
        ]);

        if (usernameCheck.data) {
            toast.error(ERROR_MESSAGES.USERNAME_TAKEN);
            return false;
        }

        if (emailCheck.data) {
            toast.error(ERROR_MESSAGES.EMAIL_TAKEN);
            return false;
        }

        return true;
    }, []);

    const onSubmit = useCallback(async (values) => {
        try {
            setLoading(LOADING_STATES.CREDENTIALS);

            const isValid = await checkExistingUser(values.username, values.email);
            if (!isValid) return;

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Sign-up error:", errorData);
                toast.error(ERROR_MESSAGES.SIGNUP_GENERIC_ERROR);
                return;
            } else {
                toast.success(SUCCESS_MESSAGES.SIGNUP_SUCCESS);
                router.push("/auth/signin");
            }
        } catch (error) {
            console.error("Sign-up error:", error);
            toast.error(ERROR_MESSAGES.GENERIC_ERROR);
        } finally {
            setLoading(LOADING_STATES.NONE);
        }
    }, [checkExistingUser, router]);

    const handleUsernameChange = useCallback((e) => {
        const sanitizedValue = sanitizeUsername(e.target.value);
        form.setValue("username", sanitizedValue);
    }, [form]);

    const handleFullnameChange = useCallback((e) => {
        const sanitizedValue = sanitizeFullname(e.target.value);
        form.setValue("fullname", sanitizedValue);
    }, [form]);

    const isSubmitDisabled = loading !== LOADING_STATES.NONE || usernameAvailable === false;

    return (
        <SignUpView
            form={form}
            loading={loading}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            togglePassword={togglePassword}
            toggleConfirmPassword={toggleConfirmPassword}
            handleGoogleSignUp={handleGoogleSignUp}
            onSubmit={onSubmit}
            handleUsernameChange={handleUsernameChange}
            handleFullnameChange={handleFullnameChange}
            usernameAvailable={usernameAvailable}
            checkingUsername={checkingUsername}
            isSubmitDisabled={isSubmitDisabled}
        />
    );
}