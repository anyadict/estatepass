import { createClient } from "@/lib/supabase/client";

export default async function TestSupabase() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("test_connection")
    .select("*");

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Supabase Connection Test
      </h1>

      {error ? (
        <p className="mt-4 text-red-600">
          Connection response: {error.message}
        </p>
      ) : (
        <p className="mt-4 text-green-600">
          Supabase is connected!
        </p>
      )}

      <pre className="mt-6">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}