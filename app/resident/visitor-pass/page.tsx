"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function VisitorPassPage() {
  const router = useRouter();

  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function generatePasscode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async function createVisitorPass(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    // Get logged-in resident
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/resident/login");
      return;
    }

    // Generate a 6-digit passcode
    const newPasscode = generatePasscode();

    const start = new Date(`${visitDate}T${validFrom}`);
    const end = new Date(`${visitDate}T${validUntil}`);

    if (end <= start) {
      setMessage("Expiry time must be later than arrival time.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("visitor_passes")
      .insert({
        resident_id: user.id,
        visitor_name: visitorName,
        visitor_phone: visitorPhone,
        passcode: newPasscode,
        valid_from: start.toISOString(),
        valid_until: end.toISOString(),
        status: "active",
      });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setPasscode(newPasscode);
    setMessage("Visitor pass created successfully!");

    setLoading(false);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-md mx-auto">

        <button
          onClick={() => router.push("/resident/dashboard")}
          className="mb-6 text-sm underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-2">
          Create Visitor Pass
        </h1>

        <p className="text-gray-600 mb-6">
          Create a temporary pass for your visitor.
        </p>

        <form
          onSubmit={createVisitorPass}
          className="space-y-4"
        >

          <div>
            <label className="block mb-1">
              Visitor Name
            </label>

            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block mb-1">
              Visitor Phone
            </label>

            <input
              type="tel"
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="08012345678"
            />
          </div>

          <div>
            <label className="block mb-1">
              Visit Date
            </label>

            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1">
              Arrival Time
            </label>

            <input
              type="time"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1">
              Expiry Time
            </label>

            <input
              type="time"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg p-3"
          >
            {loading
              ? "Creating Pass..."
              : "Generate Visitor Pass"}
          </button>

        </form>

        {message && (
          <div className="mt-6 border rounded-xl p-5">
            <p className="mb-3">
              {message}
            </p>

            {passcode && (
              <>
                <p className="text-sm text-gray-600">
                  Visitor Passcode
                </p>

                <p className="text-4xl font-bold tracking-widest mt-2">
                  {passcode}
                </p>
              </>
            )}
          </div>
        )}

      </div>
    </main>
  );
}