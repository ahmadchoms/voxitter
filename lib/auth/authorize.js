import { supabase } from "@/lib/supabase/client";
import { compare } from "bcryptjs";

export default async function authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Missing credentials");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", credentials.email.toLowerCase())
    .single();

  if (error || !user) {
    throw new Error("User not found");
  }

  const isValid = await compare(credentials.password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    role: user.role,
    points: user.points,
    is_verified: user.is_verified,
    post_count: user.post_count,
  };
}
