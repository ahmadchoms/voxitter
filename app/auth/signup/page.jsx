"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AuthCard, AuthLayout } from "@/layouts/auth-layout";
import { InputField } from "@/components/auth/input-field";
import { signUpSchema } from "@/lib/validation/users";

const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
};

const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
};

const GoogleIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

export default function SignUpPage() {
    const [loading, setLoading] = useState < "google" | "credentials" | null > (null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState < boolean | null > (
        null
    );
    const [checkingUsername, setCheckingUsername] = useState(false);
    const router = useRouter();

    const form = useForm ({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const checkUsernameAvailability = async (username) => {
        if (!username || username.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        setCheckingUsername(true);

        try {
            const { data: existingUser, error } = await supabase
                .from("users")
                .select("username")
                .eq("username", username.toLowerCase())
                .maybeSingle();

            if (error && error.code === "PGRST116") {
                setUsernameAvailable(true);
            } else if (existingUser) {
                setUsernameAvailable(false);
            } else {
                setUsernameAvailable(null);
            }
        } catch (error) {
            console.error("Error checking username:", error);
            setUsernameAvailable(null);
        } finally {
            setCheckingUsername(false);
        }
    };

    useEffect(() => {
        const username = form.watch("username");
        const timer = setTimeout(() => {
            if (username && !form.formState.errors.username) {
                checkUsernameAvailability(username);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [form.watch("username"), form.formState.errors.username]);

    const handleGoogleSignUp = async () => {
        try {
            setLoading("google");

            const result = await signIn("google", {
                redirect: false,
                callbackUrl: "/",
            });

            if (result?.error) {
                console.error("Google sign-up error:", result.error);
                toast.error("Gagal mendaftar dengan Google. Silakan coba lagi.");
            } else if (result?.ok) {
                toast.success("Berhasil mendaftar dengan Google!");
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            console.error("Google sign-up error:", error);
            toast.error("Terjadi kesalahan saat mendaftar dengan Google.");
        } finally {
            setLoading(null);
        }
    };

    const onSubmit = async (values) => {
        try {
            setLoading("credentials");

            const { data: existingUser, error: checkError } = await supabase
                .from("users")
                .select("username, email")
                .or(
                    `username.eq.${values.username.toLowerCase()},email.eq.${values.email.toLowerCase()}`
                )
                .maybeSingle();

            if (existingUser) {
                if (existingUser.username === values.username.toLowerCase()) {
                    toast.error("Username sudah digunakan. Pilih username lain.");
                    setUsernameAvailable(false);
                    return;
                }
                if (existingUser.email === values.email.toLowerCase()) {
                    toast.error(
                        "Email sudah terdaftar. Gunakan email lain atau masuk ke akun Anda."
                    );
                    return;
                }
            }

            if (checkError && checkError.code !== "PGRST116") {
                toast.error("Gagal memeriksa ketersediaan data. Silakan coba lagi.");
                return;
            }

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: values.email.toLowerCase().trim(),
                password: values.password,
                options: {
                    data: {
                        username: values.username.toLowerCase(),
                        full_name: values.fullname.trim(),
                    },
                },
            });

            if (authError || !authData.user) {
                console.error("Auth sign-up error:", authError);

                if (authError?.message?.includes("already registered")) {
                    toast.error(
                        "Email sudah terdaftar. Gunakan email lain atau masuk ke akun Anda."
                    );
                } else if (authError?.message?.includes("password")) {
                    toast.error("Password tidak memenuhi kriteria keamanan.");
                } else {
                    toast.error(
                        authError?.message ?? "Gagal membuat akun. Silakan coba lagi."
                    );
                }
                return;
            }

            const { error: insertError } = await supabase.from("users").insert([
                {
                    id: authData.user.id,
                    username: values.username.toLowerCase(),
                    full_name: values.fullname.trim(),
                    email: values.email.toLowerCase().trim(),
                    avatar_url: null,
                    bio: null,
                    points: 0,
                    is_verified: false,
                    followers_count: 0,
                    following_count: 0,
                    posts_count: 0,
                    created_at: new Date().toISOString(),
                },
            ]);

            if (insertError) {
                console.error("Profile insert error:", insertError);
                toast.error(
                    "Akun dibuat tapi gagal menyimpan profil. Hubungi administrator."
                );
                return;
            }

            toast.success(
                "Akun berhasil dibuat! Selamat datang di komunitas diskusi warga digital."
            );

            setTimeout(() => {
                router.push("/auth/signin");
            }, 1000);
        } catch (error) {
            console.error("Sign-up error:", error);
            toast.error("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
        } finally {
            setLoading(null);
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
        form.setValue("username", value);
    };

    const handleFullnameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        form.setValue("fullname", value);
    };

    return (
        <AuthLayout subtitle="Bergabung dengan komunitas diskusi warga digital">
            <AuthCard
                title="Daftar Akun Baru"
                description="Buat akun untuk mulai berdiskusi dan berbagi"
                icon={<UserPlus className="w-5 h-5" />}
            >
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <Button
                        variant="outline"
                        className="w-full bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 transition-all duration-200 h-12"
                        onClick={handleGoogleSignUp}
                        disabled={!!loading}
                    >
                        {loading === "google" ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <GoogleIcon />
                        )}
                        <span className="ml-2">Daftar dengan Google</span>
                    </Button>
                </motion.div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full bg-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-800 px-3 text-gray-400 font-medium">
                            Atau
                        </span>
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                        <motion.div variants={inputVariants}>
                            <InputField
                                id="username"
                                label="Username"
                                placeholder="pilih_username_unik"
                                register={form.register}
                                error={form.formState.errors.username}
                                disabled={loading === "credentials"}
                                onChange={handleUsernameChange}
                                helperText="Hanya huruf, angka, dan underscore"
                                trailingIcon={
                                    checkingUsername ? (
                                        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                                    ) : usernameAvailable === true ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : usernameAvailable === false ? (
                                        <div className="h-4 w-4 bg-red-500 rounded-full" />
                                    ) : null
                                }
                            />
                            {usernameAvailable === false && (
                                <p className="text-red-400 text-sm mt-1">
                                    Username sudah digunakan
                                </p>
                            )}
                        </motion.div>

                        <motion.div variants={inputVariants}>
                            <InputField
                                id="fullname"
                                label="Nama Lengkap"
                                placeholder="John Doe"
                                register={form.register}
                                error={form.formState.errors.fullname}
                                disabled={loading === "credentials"}
                                onChange={handleFullnameChange}
                                helperText="Hanya huruf dan spasi"
                            />
                        </motion.div>

                        <motion.div variants={inputVariants}>
                            <InputField
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="nama@example.com"
                                register={form.register}
                                error={form.formState.errors.email}
                                disabled={loading === "credentials"}
                            />
                        </motion.div>

                        <motion.div variants={inputVariants}>
                            <InputField
                                id="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Buat password yang kuat"
                                trailingIcon={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-transparent p-1 h-auto"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading === "credentials"}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                                        )}
                                    </Button>
                                }
                                register={form.register}
                                error={form.formState.errors.password}
                                disabled={loading === "credentials"}
                                helperText="Minimal 8 karakter, huruf besar, kecil & angka"
                            />
                        </motion.div>

                        <motion.div variants={inputVariants}>
                            <InputField
                                id="confirmPassword"
                                label="Konfirmasi Password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Ulangi password"
                                trailingIcon={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-transparent p-1 h-auto"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={loading === "credentials"}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                                        )}
                                    </Button>
                                }
                                register={form.register}
                                error={form.formState.errors.confirmPassword}
                                disabled={loading === "credentials"}
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        variants={buttonVariants}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading === "credentials" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <UserPlus className="w-4 h-4 mr-2" />
                            )}
                            Buat Akun
                        </Button>
                    </motion.div>
                </form>

                <div className="text-center text-sm text-gray-400 pt-4">
                    Sudah punya akun?{" "}
                    <Link
                        href="/auth/signin"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
                    >
                        Masuk di sini
                    </Link>
                </div>
            </AuthCard>
        </AuthLayout>
    );
}
