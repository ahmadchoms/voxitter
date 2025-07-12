import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthCard, AuthLayout } from "@/layouts/auth-layout";
import { InputField } from "@/components/forms/input-field";
import { GoogleIcon } from "@/components/fragments/google-icon";
import PasswordToggleButton from "@/components/forms/password-toggle-button";
import { UsernameStatusIcon } from "@/components/forms/username-status-icon";
import { LOADING_STATES } from "@/lib/constants/auth";
import { MOTION_VARIANTS } from "@/lib/constants/motion";

export default function SignUpView({
    form,
    loading,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    handleGoogleSignUp,
    onSubmit,
    handleUsernameChange,
    handleFullnameChange,
    usernameAvailable,
    checkingUsername,
    isSubmitDisabled,
}) {
  return (
      <AuthLayout subtitle="Bergabung dengan komunitas diskusi warga digital">
          <AuthCard
              title="Daftar Akun Baru"
              description="Buat akun untuk mulai berdiskusi dan berbagi"
              icon={<UserPlus className="w-5 h-5" />}
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
                      onClick={handleGoogleSignUp}
                      disabled={loading !== LOADING_STATES.NONE}
                  >
                      {loading === LOADING_STATES.GOOGLE ? (
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
                      <motion.div variants={MOTION_VARIANTS.input}>
                          <InputField
                              id="username"
                              label="Username"
                              placeholder="pilih_username_unik"
                              register={form.register}
                              error={form.formState.errors.username}
                              disabled={loading === LOADING_STATES.CREDENTIALS}
                              onChange={handleUsernameChange}
                              helperText="Hanya huruf, angka, dan underscore"
                              trailingIcon={
                                  <UsernameStatusIcon
                                      usernameAvailable={usernameAvailable}
                                      checkingUsername={checkingUsername}
                                  />
                              }
                          />
                          {usernameAvailable === false && (
                              <p className="text-red-400 text-sm mt-1">
                                  Username sudah digunakan
                              </p>
                          )}
                      </motion.div>

                      <motion.div variants={MOTION_VARIANTS.input}>
                          <InputField
                              id="fullname"
                              label="Nama Lengkap"
                              placeholder="John Doe"
                              register={form.register}
                              error={form.formState.errors.fullname}
                              disabled={loading === LOADING_STATES.CREDENTIALS}
                              onChange={handleFullnameChange}
                              helperText="Hanya huruf dan spasi"
                          />
                      </motion.div>

                      <motion.div variants={MOTION_VARIANTS.input}>
                          <InputField
                              id="email"
                              label="Email"
                              type="email"
                              placeholder="nama@example.com"
                              register={form.register}
                              error={form.formState.errors.email}
                              disabled={loading === LOADING_STATES.CREDENTIALS}
                          />
                      </motion.div>

                      <motion.div variants={MOTION_VARIANTS.input}>
                          <InputField
                              id="password"
                              label="Password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Buat password yang kuat"
                              trailingIcon={
                                  <PasswordToggleButton
                                      show={showPassword}
                                      toggle={togglePassword}
                                      disabled={loading === LOADING_STATES.CREDENTIALS}
                                  />
                              }
                              register={form.register}
                              error={form.formState.errors.password}
                              disabled={loading === LOADING_STATES.CREDENTIALS}
                              helperText="Minimal 8 karakter, huruf besar, kecil & angka"
                          />
                      </motion.div>

                      <motion.div variants={MOTION_VARIANTS.input}>
                          <InputField
                              id="confirmPassword"
                              label="Konfirmasi Password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Ulangi password"
                              trailingIcon={
                                  <PasswordToggleButton
                                      show={showConfirmPassword}
                                      toggle={toggleConfirmPassword}
                                      disabled={loading === LOADING_STATES.CREDENTIALS}
                                  />
                              }
                              register={form.register}
                              error={form.formState.errors.confirmPassword}
                              disabled={loading === LOADING_STATES.CREDENTIALS}
                          />
                      </motion.div>
                  </div>

                  <motion.div
                      variants={MOTION_VARIANTS.button}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                      <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitDisabled}
                      >
                          {loading === LOADING_STATES.CREDENTIALS ? (
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
  )
}
