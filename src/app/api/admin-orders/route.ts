
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!adminEmail) {
      return NextResponse.json(
        { error: "Admin access is not configured." },
        { status: 500 }
      );
    }

    const authClient = await createClient();

    if (!authClient) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 500 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user?.email) {
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

    const supabase = createAdminSupabaseClient();

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, phone, email, city, address, payment_method, status, subtotal, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("ADMIN ORDERS QUERY ERROR:", error);
      return NextResponse.json(
        { error: "Could not load orders." },
        { status: 500 }
      );
    }

    const orderIds = (orders ?? []).map((order) => order.id);

    let items: {
      order_id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      line_total: number;
    }[] = [];

    if (orderIds.length > 0) {
      const { data, error: itemsError } = await supabase
        .from("order_items")
        .select("order_id, product_name, quantity, unit_price, line_total")
        .in("order_id", orderIds);

      if (itemsError) {
        console.error("ADMIN ORDER ITEMS QUERY ERROR:", itemsError);
        return NextResponse.json(
          { error: "Could not load order items." },
          { status: 500 }
        );
      }

      items = data ?? [];
    }

    return NextResponse.json(
      {
        orders: (orders ?? []).map((order) => ({
          ...order,
          items: items.filter((item) => item.order_id === order.id),
        })),
      },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("ADMIN ORDERS API ERROR:", error);

    return NextResponse.json(
      { error: "Server error while loading orders." },
      { status: 500 }
    );
  }
}
