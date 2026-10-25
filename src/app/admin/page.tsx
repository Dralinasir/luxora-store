
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage("Login failed. Please check your email and password.");
        return;
      }

      const response = await fetch("/api/admin/check", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        await supabase.auth.signOut();
        setMessage(
          "This account does not have admin access yet. Please configure admin access first."
        );
        return;
      }

      router.push("/admin/orders");
      router.refresh();
    } catch {
      setMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-5 text-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"
      >
        <p className="text-sm font-semibold tracking-widest text-gray-500">
          LUXORA
        </p>

        <h1 className="mt-3 text-3xl font-bold">Admin Login</h1>

        <p className="mt-2 text-sm text-gray-600">
          Sign in to manage your store.
        </p>

        <label className="mt-6 block text-sm font-medium">
          Email address
        </label>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your admin email"
        />

        <label className="mt-4 block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {message && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
