import { notFound } from "next/navigation";
import { getMusicians } from "@/lib/get-musicians";
import { getMusicianEvents } from "@/lib/get-musician-events";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function avatarColor(role: string | undefined) {
  const r = (role ?? "").toLowerCase();

  if (r.includes("chant")) return "bg-violet-100 text-violet-700";
  if (r.includes("piano") || r.includes("clavier"))
    return "bg-blue-100 text-blue-700";
  if (r.includes("batt")) return "bg-orange-100 text-orange-700";
  if (r.includes("guit")) return "bg-emerald-100 text-emerald-700";
  if (r.includes("basse")) return "bg-teal-100 text-teal-700";
  if (r.includes("sax")) return "bg-red-100 text-red-700";

  return "bg-slate-200 text-slate-700";
}

export default async function ProfilPage({ params }: PageProps) {
  const { id } = await params;

  const musicians = await getMusicians();

  const musician = musicians.find((m) => m.id === id);

  if (!musician) {
    notFound();
  }

  const mesEvenements = await getMusicianEvents(id);

  return (
    <main className="min-h-screen bg-[#F8F2E8] p-6 text-[#243B53]">

      <section className="rounded-[32px] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">

          <div
            className={`flex h-28 w-28 items-center justify-center rounded-full text-5xl font-bold shadow-lg ${avatarColor(
              musician.role
            )}`}
          >
            {musician.prenom.charAt(0)}
          </div>

          <h1 className="mt-6 text-4xl font-bold">
            {musician.prenom}
          </h1>

          <span className="mt-3 rounded-full bg-[#EEF4FB] px-4 py-2 text-sm font-semibold text-[#1E6FB8]">
            {musician.role}
          </span>

          {musician.ville && (
            <p className="mt-5 text-gray-500">
              📍 {musician.ville}
            </p>
          )}

        </div>
      </section>

      <section className="mt-8">
        <AvailabilityCalendar unavailableDates={[]} />
      </section>

      <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-2xl font-semibold">
          Mes événements
        </h2>

        {mesEvenements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
            Aucun événement prévu.
          </div>
        ) : (
          <div className="space-y-4">

            {mesEvenements.map((event: any) => (
              <div
                key={event.id}
                className="rounded-2xl border p-4"
              >
                <h3 className="text-lg font-semibold">
                  {event.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  📅 {event.date}
                </p>

                <p className="text-gray-600">
                  🕒 {event.start_time} - {event.end_time}
                </p>

                <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {event.status}
                </span>
              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}