
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (
      !orderNumber ||
      orderNumber.length > 100 ||
      !phone ||
      phone.length > 20
    ) {
      return NextResponse.json(
        { error: "Please enter your order number and phone number." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    if (normalizedPhone.length < 7 || normalizedPhone.length > 15) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, order_number, status, created_at, payment_method, subtotal, phone"
      )
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (orderError) {
      console.error("Tracking order lookup failed:", orderError);
      return NextResponse.json(
        { error: "Unable to look up this order right now." },
        { status: 500 }
      );
    }

    // Use the same generic response for an unknown order
    // and a phone number that does not match.
    if (
      !order ||
      normalizePhone(order.phone ?? "") !== normalizedPhone
    ) {
      return NextResponse.json(
        {
          error:
            "Order not found or phone number does not match. Please check your details.",
        },
        { status: 404 }
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("product_name, quantity, line_total")
      .eq("order_id", order.id);

    if (itemsError) {
      console.error("Tracking order items lookup failed:", itemsError);
      return NextResponse.json(
        { error: "Unable to load order items right now." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        order: {
          order_number: order.order_number,
          status: order.status,
          created_at: order.created_at,
          payment_method: order.payment_method,
          subtotal: order.subtotal,
          items: items ?? [],
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Tracking API error:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
