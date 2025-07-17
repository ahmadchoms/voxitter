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
