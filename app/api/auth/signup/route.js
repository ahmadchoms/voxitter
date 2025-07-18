import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, username, fullname } = body;

    if (!email || !password || !username || !fullname) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("id, email, username")
      .or(
        `email.eq.${email.toLowerCase()},username.eq.${username.toLowerCase()}`
      );

    if (checkError) {
      console.error("Database check error:", checkError);
      return NextResponse.json(
        { message: "Terjadi kesalahan saat memeriksa data" },
        { status: 500 }
      );
    }

    if (existingUsers?.length > 0) {
      const emails = existingUsers.map((u) => u.email);
      const usernames = existingUsers.map((u) => u.username);

      if (emails.includes(email.toLowerCase())) {
        return NextResponse.json(
          { message: "Email sudah terdaftar" },
          { status: 400 }
        );
      }

      if (usernames.includes(username.toLowerCase())) {
        return NextResponse.json(
          { message: "Username sudah digunakan" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hash(password, 12);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email: email.toLowerCase(),
          password: hashedPassword,
          username: username.toLowerCase(),
          full_name: fullname,
          avatar_url: null,
          bio: null,
          points: 0,
          is_verified: false,
          post_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("User creation error:", insertError);

      if (insertError.code === "23505") {
        if (insertError.message.includes("email")) {
          return NextResponse.json(
            { message: "Email sudah terdaftar" },
            { status: 400 }
          );
        }
        if (insertError.message.includes("username")) {
          return NextResponse.json(
            { message: "Username sudah digunakan" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { message: "Gagal mendaftarkan akun" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Berhasil membuat akun",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          full_name: newUser.full_name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
