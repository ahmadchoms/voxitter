"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { AuthCard, AuthLayout } from "@/layouts/auth-layout";
import { InputField } from "@/components/auth/input-field";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signInSchema } from "@/lib/validation/users";

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export default function SignInPage() {
  const [loading, setLoading] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema
    ),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleGoogleSignIn = async () => {
    try {
      setLoading("google");

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        toast.error("Gagal masuk dengan Google. Silakan coba lagi.");
      } else if (result?.ok) {
        toast.success("Berhasil masuk dengan Google!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Terjadi kesalahan saat masuk dengan Google.");
    } finally {
      setLoading(null);
    }
  };

  const onSubmit = async (values) => {
    try {
      setLoading("credentials");

      const result = await signIn("credentials", {
        redirect: false,
        email: values.email.toLowerCase().trim(),
        password: values.password,
        callbackUrl: "/",
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Email atau password salah. Silakan periksa kembali.");
        } else if (result.error === "AccessDenied") {
          toast.error("Akses ditolak. Hubungi administrator.");
        } else {
          toast.error("Gagal masuk. Silakan coba lagi.");
        }
      } else if (result?.ok) {
        toast.success("Berhasil masuk! Selamat datang kembali.");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        "Terjadi kesalahan saat login. Coba lagi beberapa saat lagi."
      );
    } finally {
      setLoading(null);
    }
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

  return (
    <AuthLayout subtitle="Masuk ke akun Anda untuk melanjutkan">
      <AuthCard
        title="Masuk"
        description="Pilih metode masuk yang Anda inginkan"
        icon={<LogIn className="w-5 h-5" />}
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
            onClick={handleGoogleSignIn}
            disabled={!!loading}
          >
            {loading === "google" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span className="ml-2">Lanjutkan dengan Google</span>
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
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="nama@example.com"
              register={form.register}
              error={form.formState.errors.email}
              disabled={loading === "credentials"}
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
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
            />
          </div>

          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Lupa password?
            </Link>
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
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Masuk
            </Button>
          </motion.div>
        </form>

        <div className="text-center text-sm text-gray-400 pt-4">
          Belum punya akun?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
          >
            Daftar di sini
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
