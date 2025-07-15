import { usersService } from "@/lib/supabase/users";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const res = await usersService.getUserProfile(params?.id);

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
