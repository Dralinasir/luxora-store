
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      const name = String(formData.get("name") || "").trim();

      const supabase = createClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.href = "/admin/orders";
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) throw error;

      if (data.session) {
        setMessage("Account created successfully. You can now sign in.");
        setMode("login");
      } else {
        setMessage(
          "Account request submitted. Check your email to confirm your account, then sign in."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-white px-5 py-16 text-black">
      <div className="mx-auto max-w-md">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gray-500">
          Welcome to LUXORA
        </p>

        <h1 className="mt-4 text-center text-3xl font-bold">
          {mode === "login" ? "Sign in to your account" : "Create your account"}
        </h1>

        <p className="mt-3 text-center text-sm text-gray-500">
          {mode === "login"
            ? "Access your orders and manage your profile."
            : "Join LUXORA for a convenient shopping experience."}
        </p>

        <div className="mt-8 grid grid-cols-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setMessage("");
            }}
            className={`border-b-2 py-3 text-sm font-medium ${
              mode === "login"
                ? "border-black"
                : "border-transparent text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
              setMessage("");
            }}
            className={`border-b-2 py-3 text-sm font-medium ${
              mode === "signup"
                ? "border-black"
                : "border-transparent text-gray-500"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            {message}
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
              required
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
