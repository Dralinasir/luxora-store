
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Server database configuration is missing.");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function validText(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;

    if (
      !validText(data.name, 100) ||
      !validText(data.phone, 20) ||
      !validText(data.city, 100) ||
      !validText(data.address, 500) ||
      data.address.trim().length < 10
    ) {
      return NextResponse.json(
        { error: "Please provide valid delivery details." },
        { status: 400 }
      );
    }

    if (
      data.email !== undefined &&
      data.email !== null &&
      data.email !== "" &&
      (typeof data.email !== "string" ||
        data.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    ) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(data.items) ||
      data.items.length < 1 ||
      data.items.length > 50
    ) {
      return NextResponse.json(
        { error: "Your cart is empty or invalid." },
        { status: 400 }
      );
    }

    const seenIds = new Set<string>();
    const requestedItems: { product_id: string; quantity: number }[] = [];

    for (const item of data.items) {
      if (!item || typeof item !== "object") {
        return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
      }

      const row = item as Record<string, unknown>;

      if (
        typeof row.productId !== "string" ||
        !row.productId.trim() ||
        row.productId.length > 100 ||
        typeof row.quantity !== "number" ||
        !Number.isInteger(row.quantity) ||
        row.quantity < 1 ||
        row.quantity > 20 ||
        seenIds.has(row.productId)
      ) {
        return NextResponse.json(
          { error: "Invalid product or quantity." },
          { status: 400 }
        );
      }

      seenIds.add(row.productId);
      requestedItems.push({
        product_id: row.productId,
        quantity: row.quantity,
      });
    }

    const supabase = getAdminClient();

    const orderNumber = `LUX-${Date.now()}-${crypto
      .randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;

    const { data: result, error } = await supabase.rpc(
      "place_order_with_stock",
      {
        p_customer_name: data.name.trim(),
        p_phone: data.phone.trim(),
        p_email:
          typeof data.email === "string" && data.email.trim()
            ? data.email.trim()
            : null,
        p_city: data.city.trim(),
        p_address: data.address.trim(),
        p_payment_method: "cod",
        p_order_number: orderNumber,
        p_items: requestedItems,
      }
    );

    if (error) {
      console.error("ORDER CREATION FAILED:", error);

      const stockError =
        error.message.toLowerCase().includes("stock") ||
        error.message.toLowerCase().includes("unavailable");

      return NextResponse.json(
        {
          error: stockError
            ? "A product is unavailable or has insufficient stock. Please update your cart."
            : "Could not place your order. Please check your database function and permissions.",
        },
        { status: stockError ? 409 : 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderNumber: result.order_number,
        message: "Your COD order has been placed successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER API ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please check your terminal." },
      { status: 500 }
    );
  }
}
