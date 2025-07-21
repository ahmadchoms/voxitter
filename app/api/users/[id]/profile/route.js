import { authOptions } from "@/lib/auth/options";
import { usersService } from "@/lib/supabase/users";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const res = await usersService.getUserProfile(params?.id, userId);

    if (res.error || !res.data) {
      return NextResponse.json(
        { error: res.error || "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const result = await usersService.updateUser(params.id, validatedData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}