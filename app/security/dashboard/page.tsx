"use client";

import { useState } from "react";

export default function SecurityDashboard() {
  const [passcode, setPasscode] = useState("");

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    alert(`Checking passcode: ${passcode}`);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            EstatePass Security
          </h1>

          <p className="mt-2 text-gray-600">
            Verify visitor passes at the estate gate.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Verify Visitor Pass
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Enter the visitor's passcode below.
          </p>

          <form onSubmit={handleVerify} className="mt-6 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Visitor Passcode
              </label>

              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                maxLength={6}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg tracking-widest outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-black px-5 py-4 font-medium text-white"
            >
              Verify Pass
            </button>

          </form>

        </div>

      </div>
    </main>
  );
}