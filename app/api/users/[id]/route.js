import { NextResponse } from "next/server";
import { usersService } from "@/lib/supabase/users";
import { updateUserSchema } from "@/lib/validation/users";

export async function GET(request, { params }) {
  try {
    const result = await usersService.getUserById(params.id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const result = await usersService.updateUser(params.id, validatedData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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
