
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";

async function isAdmin() {
  const supabase = await createClient();

  if (!supabase) return false;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) return false;

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  return Boolean(adminEmail && user.email.toLowerCase() === adminEmail);
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeOptionalString(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }

  return value == null ? null : value;
}

function normalizeNumeric(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return NaN;
    return Number(trimmed);
  }

  return Number(value);
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "Products load nahi ho sake." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const rawSlug = typeof body.slug === "string" ? body.slug.trim() : "";
    const slug = makeSlug(rawSlug || name);
    const description = normalizeOptionalString(body.description);
    const category = normalizeOptionalString(body.category);
    const imageUrl = normalizeOptionalString(body.image_url);
    const price = normalizeNumeric(body.price);
    const compareAtPrice =
      body.compare_at_price == null || body.compare_at_price === ""
        ? null
        : normalizeNumeric(body.compare_at_price);
    const stock = normalizeNumeric(body.stock ?? 0);

    if (
      !name ||
      !slug ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        { error: "Name, slug, valid price aur stock zaroori hain." },
        { status: 400 }
      );
    }

    if (
      compareAtPrice !== null &&
      (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)
    ) {
      return NextResponse.json(
        { error: "Compare-at price valid nahi hai." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        price,
        compare_at_price: compareAtPrice,
        category,
        image_url: imageUrl,
        stock,
        is_featured: body.is_featured === true,
        is_active: body.is_active !== false,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Ye slug pehle se mojood hai." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { error: "Product save nahi ho saka." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
    }

    const id = typeof body.id === "string" ? body.id : "";

    if (!validId(id)) {
      return NextResponse.json({ error: "Product ID valid nahi hai." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    const allowedFields = [
      "name",
      "slug",
      "description",
      "price",
      "compare_at_price",
      "category",
      "image_url",
      "stock",
      "is_featured",
      "is_active",
    ] as const;

    for (const field of allowedFields) {
      if (!Object.prototype.hasOwnProperty.call(body, field)) {
        continue;
      }

      const value = body[field];

      if (field === "name") {
        const trimmed = typeof value === "string" ? value.trim() : "";
        if (!trimmed) {
          return NextResponse.json({ error: "Name aur slug khaali nahi ho sakte." }, { status: 400 });
        }
        updates.name = trimmed;
        continue;
      }

      if (field === "slug") {
        const trimmed = typeof value === "string" ? value.trim() : "";
        const slug = makeSlug(trimmed || "");
        if (!slug) {
          return NextResponse.json({ error: "Name aur slug khaali nahi ho sakte." }, { status: 400 });
        }
        updates.slug = slug;
        continue;
      }

      if (field === "description" || field === "category" || field === "image_url") {
        updates[field] = normalizeOptionalString(value);
        continue;
      }

      if (field === "price") {
        const price = normalizeNumeric(value);
        if (!Number.isFinite(price) || price < 0) {
          return NextResponse.json({ error: "Price valid nahi hai." }, { status: 400 });
        }
        updates.price = price;
        continue;
      }

      if (field === "compare_at_price") {
        if (value == null || value === "") {
          updates.compare_at_price = null;
          continue;
        }

        const compareAtPrice = normalizeNumeric(value);
        if (!Number.isFinite(compareAtPrice) || compareAtPrice < 0) {
          return NextResponse.json({ error: "Compare-at price valid nahi hai." }, { status: 400 });
        }
        updates.compare_at_price = compareAtPrice;
        continue;
      }

      if (field === "stock") {
        const stock = normalizeNumeric(value);
        if (!Number.isInteger(stock) || stock < 0) {
          return NextResponse.json({ error: "Stock valid nahi hai." }, { status: 400 });
        }
        updates.stock = stock;
        continue;
      }

      if (field === "is_active" || field === "is_featured") {
        if (typeof value !== "boolean") {
          return NextResponse.json({ error: `${field} boolean hona chahiye.` }, { status: 400 });
        }
        updates[field] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Koi update field nahi diya." }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Ye slug pehle se mojood hai." }, { status: 409 });
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Product nahi mila." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: data });
    } catch (error) {
    console.error("Products PATCH error:", error);

    const details =
      error instanceof Error
        ? error.message
        : "Unknown error";

    return NextResponse.json(
      {
        error: "Product update nahi ho saka.",
        details:
          process.env.NODE_ENV === "development"
            ? details
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") ?? "";

    if (!validId(id)) {
      return NextResponse.json({ error: "Product ID valid nahi hai." }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Product nahi mila." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json({ error: "Product delete nahi ho saka." }, { status: 500 });
  }
}
