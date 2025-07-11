import React from "react";
import { motion } from "framer-motion";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InputField } from "@/components/forms/input-field";
import { GoogleIcon } from "@/components/fragments/google-icon";
import PasswordToggleButton from "@/components/forms/password-toggle-button";
import { AuthCard, AuthLayout } from "@/layouts/auth-layout";
import { LOADING_STATES, MOTION_VARIANTS } from "@/lib/constants/auth";

function SignInView({ form, loading, showPassword, togglePassword, handleGoogleSignIn, onSubmit }) {
  return (
      <AuthLayout subtitle="Masuk ke akun Anda untuk melanjutkan">
          <AuthCard
              title="Masuk"
              description="Pilih metode masuk yang Anda inginkan"
              icon={<LogIn className="w-5 h-5" />}
          >
              <motion.div
                  variants={MOTION_VARIANTS.button}
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
                              <PasswordToggleButton
                                  show={showPassword}
                                  toggle={togglePassword}
                                  disabled={loading === LOADING_STATES.CREDENTIALS}
                              />
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
                      variants={MOTION_VARIANTS.button}
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
  )
}

export default SignInView