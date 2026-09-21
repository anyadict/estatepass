"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SecurityLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setMessage("Login failed.");
      setLoading(false);
      return;
    }

    // Check the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();

      setMessage("Security profile not found.");
      setLoading(false);
      return;
    }

    // Make sure this is actually a security account
    if (profile.role !== "security") {
      await supabase.auth.signOut();

      setMessage("This account is not authorized for security access.");
      setLoading(false);
      return;
    }

    router.push("/security/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full rounded-2xl bg-white p-8 shadow-sm">

          <h1 className="text-3xl font-bold text-gray-900">
            Security Login
          </h1>

          <p className="mt-2 text-gray-600">
            Sign in to verify visitor passes.
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="security@example.com"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {message && (
            <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {message}
            </p>
          )}

        </div>
      </div>
    </main>
  );
}