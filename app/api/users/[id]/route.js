import { NextResponse } from "next/server";
import { usersService } from "@/lib/supabase/users";
import { postsService } from "@/lib/supabase/posts";
import { updateUserSchema } from "@/lib/validation/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function GET(request, context) {
  const { params } = context;
  const username = params.id;
  try {
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const userRes = await usersService.getUserByUsername(username);

    if (userRes.error || !userRes.data) {
      return NextResponse.json(
        { error: userRes.error || "User not found" },
        { status: 404 }
      );
    }

    const postRes = await postsService.getPostsByUser(userRes.data.id);

    if (postRes.error) {
      return NextResponse.json({ error: postRes.error }, { status: 500 });
    }

    return NextResponse.json({
      user: userRes.data,
      posts: postRes.data,
    });
  } catch (error) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

export async function PUT(request, context) {
  const { params } = context;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

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

export async function DELETE(request, context) {
  const { params } = context;
  try {
    const result = await usersService.deleteUser(params.id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
