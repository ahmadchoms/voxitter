import { supabase } from "@/lib/supabase/client"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials")
                }

                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                })

                if (error || !data.user) {
                    throw new Error(
                        error?.code === "invalid_credentials"
                            ? "Invalid email or password"
                            : "Authentication failed"
                    )
                }

                const { data: userProfile, error: profileError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", credentials.email)
                    .single()

                if (profileError || !userProfile) {
                    console.error("Error fetching user profile:", profileError)
                    throw new Error("User profile not found")
                }

                return {
                    id: userProfile.id,
                    email: userProfile.email,
                    username: userProfile.username,
                    full_name: userProfile.full_name,
                    avatar_url: userProfile.avatar_url,
                    bio: userProfile.bio,
                    points: userProfile.points,
                    is_verified: userProfile.is_verified,
                    posts_count: userProfile.posts_count,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.full_name = user.full_name
                token.avatar_url = user.avatar_url
                token.bio = user.bio
                token.points = user.points
                token.is_verified = user.is_verified
                token.posts_count = user.posts_count
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user = {
                    ...session.user,
                    id: token.id,
                    username: token.username,
                    full_name: token.full_name,
                    avatar_url: token.avatar_url,
                    bio: token.bio,
                    points: token.points,
                    is_verified: token.is_verified,
                    posts_count: token.posts_count,
                }
            }
            return session
        },
        async signIn({ user, account }) {
            if (account?.provider === "google" && user.email) {
                try {
                    const { data: existingUser, error } = await supabase
                        .from("users")
                        .select("*")
                        .eq("email", user.email)
                        .single()

                    if (error && error.code !== "PGRST116") {
                        console.error("Error checking existing user:", error)
                        return false
                    }

                    if (!existingUser) {
                        const usernameBase = user.email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "user"
                        const uniqueSuffix = Math.floor(Math.random() * 10000)
                        const username = `${usernameBase}${uniqueSuffix}`

                        const { data: newUser, error: insertError } = await supabase
                            .from("users")
                            .insert({
                                email: user.email,
                                username,
                                full_name: user.name || username,
                                avatar_url: user.image || null,
                                bio: null,
                                points: 0,
                                is_verified: false,
                                posts_count: 0,
                                created_at: new Date().toISOString(),
                            })
                            .select()
                            .maybeSingle()

                        if (insertError) {
                            console.error("Error creating new user:", insertError)
                            return false
                        }

                        user.id = newUser.id
                        user.username = newUser.username
                        user.full_name = newUser.full_name
                        user.avatar_url = newUser.avatar_url
                        user.bio = newUser.bio
                        user.points = newUser.points
                        user.is_verified = newUser.is_verified
                        user.posts_count = newUser.posts_count
                    } else {
                        user.id = existingUser.id
                        user.username = existingUser.username
                        user.full_name = existingUser.full_name
                        user.avatar_url = existingUser.avatar_url
                        user.bio = existingUser.bio
                        user.points = existingUser.points
                        user.is_verified = existingUser.is_verified
                        user.posts_count = existingUser.posts_count
                    }

                    return true
                } catch (err) {
                    console.error("Error in Google signIn callback:", err)
                    return false
                }
            }
            return true
        },
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }