import { supabase } from "@/lib/supabase/client";

export default async function signIn({ user, account }) {
  if (account?.provider === "google" && user.email) {
    try {
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

      if (error && error.code !== "PGRST116") {
        return false;
      }

      if (!existingUser) {
        const usernameBase =
          user.email
            .split("@")[0]
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "") || "user";
        const uniqueSuffix = Math.floor(Math.random() * 10000);
        const username = `${usernameBase}${uniqueSuffix}`;

        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            email: user.email,
            username,
            full_name: user.name || username,
            avatar_url: user.image || null,
            bio: null,
            role: "author",
            points: 0,
            is_verified: false,
            post_count: 0,
            created_at: new Date().toISOString(),
          })
          .select()
          .maybeSingle();

        if (insertError) {
          return false;
        }

        Object.assign(user, newUser);
      } else {
        Object.assign(user, existingUser);
      }

      return true;
    } catch (err) {
      console.error("Google sign-in error:", err);
      return false;
    }
  }
  return true;
}
