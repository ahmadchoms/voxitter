import { usersService } from "@/lib/supabase/users";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const { data, error } = await usersService.getLeaderboardUsers(limit);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data leaderboard." },
      { status: 500 }
    );
  }
}
