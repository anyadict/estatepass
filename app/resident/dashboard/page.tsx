"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Profile = {
  full_name: string;
  role: string;
  estate_id: string | null;
};

type Estate = {
  name: string;
  address: string | null;
};

type VisitorPass = {
  id: string;
  visitor_name: string;
  visitor_phone: string | null;
  passcode: string;
  valid_from: string;
  valid_until: string;
  status: string;
};

export default function ResidentDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [estate, setEstate] = useState<Estate | null>(null);
  const [visitorPasses, setVisitorPasses] = useState<VisitorPass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/resident/login");
        return;
      }

      // Get resident profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role, estate_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        console.error(profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Get estate
      if (profileData.estate_id) {
        const { data: estateData } = await supabase
          .from("estates")
          .select("name, address")
          .eq("id", profileData.estate_id)
          .single();

        if (estateData) {
          setEstate(estateData);
        }
      }

      // Get visitor passes
      const { data: passes, error: passesError } = await supabase
        .from("visitor_passes")
        .select(
          "id, visitor_name, visitor_phone, passcode, valid_from, valid_until, status"
        )
        .eq("resident_id", user.id)
        .order("created_at", { ascending: false });

      if (passesError) {
        console.error(passesError);
      } else {
        setVisitorPasses(passes || []);
      }

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/resident/login");
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">
              EstatePass
            </h1>

            <p className="text-gray-600">
              Resident Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="border rounded-lg px-4 py-2"
          >
            Logout
          </button>
        </header>

        {/* Welcome */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome, {profile?.full_name} 👋
          </h2>

          <p className="text-gray-600 mt-2">
            Manage your visitors and visitor passes.
          </p>
        </section>

        {/* Estate */}
        <section className="border rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Your Estate
          </h3>

          {estate ? (
            <>
              <p className="font-medium">
                {estate.name}
              </p>

              <p className="text-gray-600">
                {estate.address}
              </p>
            </>
          ) : (
            <p className="text-gray-600">
              No estate assigned.
            </p>
          )}
        </section>

        {/* Create pass */}
        <section className="mb-8">
          <button
            onClick={() => router.push("/resident/visitor-pass")}
            className="bg-black text-white rounded-lg px-6 py-3"
          >
            + Create Visitor Pass
          </button>
        </section>

        {/* Visitor passes */}
        <section>
          <h3 className="text-xl font-semibold mb-4">
            My Visitor Passes
          </h3>

          {visitorPasses.length === 0 ? (
            <div className="border rounded-xl p-6">
              <p className="text-gray-600">
                You haven't created any visitor passes yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {visitorPasses.map((pass) => (
                <div
                  key={pass.id}
                  className="border rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h4 className="text-lg font-semibold">
                        {pass.visitor_name}
                      </h4>

                      {pass.visitor_phone && (
                        <p className="text-gray-600">
                          {pass.visitor_phone}
                        </p>
                      )}
                    </div>

                    <span className="text-sm border rounded-full px-3 py-1">
                      {pass.status}
                    </span>

                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-gray-600">
                      Passcode
                    </p>

                    <p className="text-3xl font-bold tracking-widest">
                      {pass.passcode}
                    </p>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      Valid from: {formatDateTime(pass.valid_from)}
                    </p>

                    <p>
                      Valid until: {formatDateTime(pass.valid_until)}
                    </p>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}