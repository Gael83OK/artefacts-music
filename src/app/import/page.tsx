import { importMusicians } from "@/lib/import-musicians";

export default async function ImportPage() {
  await importMusicians();

  return (
    <main className="min-h-screen bg-[#F8F2E8] p-8 text-[#243B53]">
      <h1 className="text-3xl font-semibold">
        Import des musiciens terminé ✅
      </h1>

      <p className="mt-4 text-[#6B7280]">
        Les musiciens ont été envoyés dans Supabase.
      </p>
    </main>
  );
}