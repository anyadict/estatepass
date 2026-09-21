import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-5">
        <h1 className="text-2xl font-bold text-gray-900">
          EstatePass
        </h1>

        <div className="flex gap-3">
          <Link
            href="/resident/login"
            className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
          >
            Resident Login
          </Link>

          <Link
            href="/security/login"
            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
          >
            Security Login
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-8 py-24 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-gray-900">
          Secure Visitor Management
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Create visitor passes, send secure passcodes, and manage
          estate visitors with ease.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/resident/login"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Create Visitor Pass
          </Link>

          <Link
            href="/security/login"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            Verify Pass
          </Link>
        </div>
      </section>
    </main>
  );
}
