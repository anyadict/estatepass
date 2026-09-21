"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResidentRegister() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [estateCode, setEstateCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    // 1. Find the estate using the estate code
    const { data: estate, error: estateError } = await supabase
      .from("estates")
      .select("id, name")
      .eq("estate_code", estateCode.trim().toUpperCase())
      .single();

    if (estateError || !estate) {
      setMessage("Invalid estate code.");
      setLoading(false);
      return;
    }

    // 2. Create the authentication account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setMessage("Registration failed.");
      setLoading(false);
      return;
    }

    // 3. Create the resident profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        estate_id: estate.id,
        full_name: fullName,
        role: "resident",
      });

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    setMessage(`Registration successful! Welcome to ${estate.name}.`);

    setTimeout(() => {
      router.push("/resident/login");
    }, 1500);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">
          Create Resident Account
        </h1>

        <p className="text-gray-600 mb-6">
          Create your EstatePass resident account.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="block mb-1">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border rounded-lg p-3"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block mb-1">
              Estate Code
            </label>

            <input
              type="text"
              value={estateCode}
              onChange={(e) => setEstateCode(e.target.value)}
              required
              className="w-full border rounded-lg p-3 uppercase"
              placeholder="e.g. GRN48291"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg p-3"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {message && (
          <p className="mt-4">
            {message}
          </p>
        )}

        <button
          onClick={() => router.push("/resident/login")}
          className="mt-4 text-sm underline"
        >
          Already have an account? Login
        </button>
      </div>
    </main>
  );
}