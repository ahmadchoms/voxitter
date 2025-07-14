import { NextResponse } from "next/server";
import { usersService } from "@/lib/supabase/users";
import { userSchema } from "@/lib/validation/user";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "25");
    const offset = Number.parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");

    let result;

    if (search) {
      result = await usersService.searchUsers(search, offset, limit);
    } else {
      result = await usersService.getUsers(offset, limit);
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    const result = await usersService.createUser(validatedData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
