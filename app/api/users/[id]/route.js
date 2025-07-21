import { NextResponse } from "next/server";
import { usersService } from "@/lib/supabase/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { updateProfileSchema } from "@/lib/validation/user";

export async function GET(request) {
  const { searchTerm, offset = 0, limit = 25 } = request.query;

  if (!searchTerm) {
    return NextResponse.json(
      { error: "Search term is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await usersService.searchUsers(
      searchTerm,
      parseInt(offset),
      parseInt(limit)
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 200 });
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
