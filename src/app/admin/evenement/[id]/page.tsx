import Link from "next/link";
import { getEvent } from "@/lib/repositories/events";
import { getMusicians } from "@/lib/get-musicians";
import { getEventMusicians } from "@/lib/repositories/event-musicians";
import EventMusicians from "@/components/events/EventMusicians";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventPage({ params }: Props) {
  const { id } = await params;

  const event = await getEvent(id);

  if (!event) {
    return (
      <main className="min-h-screen bg-[#F8F2E8] p-8 text-[#243B53]">
        <h1 className="text-3xl font-bold">
          Événement introuvable
        </h1>

        <Link
          href="/admin"
          className="mt-6 inline-block rounded-xl bg-[#1E6FB8] px-6 py-3 text-white"
        >
          ← Retour à la production
        </Link>
      </main>
    );
  }

  const musicians = await getMusicians();
  const selectedMusicians = await getEventMusicians(id);

  return (
    <main className="min-h-screen bg-[#F8F2E8] p-6 text-[#243B53]">

      <Link
        href="/admin"
        className="mb-6 inline-block text-[#1E6FB8] hover:underline"
      >
        ← Retour
      </Link>

      <header className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-4xl font-bold">
          {event.title}
        </h1>

        <p className="mt-2 text-[#6B7280]">
          {event.status}
        </p>
      </header>

      <div className="space-y-5">

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            📅 Date
          </h2>

          <p className="mt-2">
            {event.date}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            🕒 Horaires
          </h2>

          <p className="mt-2">
            {event.start_time} → {event.end_time}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            📝 Notes
          </h2>

          <p className="mt-2">
            {event.notes || "Aucune remarque"}
          </p>
        </div>

        <EventMusicians
          eventId={event.id}
          musicians={musicians}
          selectedMusicians={selectedMusicians}
        />

      </div>

    </main>
  );
}