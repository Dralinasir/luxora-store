
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!adminEmail) {
      return NextResponse.json(
        { error: "Admin email is not configured." },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 500 }
      );
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    if (user.email.trim().toLowerCase() !== adminEmail) {
      return NextResponse.json(
        { error: "Admin access denied." },
        { status: 403 }
      );
    }

    return NextResponse.json({ isAdmin: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to verify admin access." },
      { status: 500 }
    );
  }
}
