import { notFound } from "next/navigation";
import { musicians, events, venues, formations } from "@/lib/mock-data";
import { EventCard } from "@/components/events/EventCard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilPage({ params }: PageProps) {
  const { id } = await params;

  const musician = musicians.find((m) => m.id === id);

  if (!musician) {
    notFound();
  }

  const mesEvenements = events.filter((event) =>
    event.musicienIds.includes(musician.id)
  );

  return (
    <main className="min-h-screen bg-[#F8F2E8] p-8 text-[#243B53]">
      <h1 className="text-4xl font-semibold">{musician.prenom}</h1>

      <p className="mt-2 text-[#6B7280]">
        {musician.role}
      </p>

      {musician.ville && (
        <p className="mt-4">
          📍 {musician.ville}
        </p>
      )}

      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-semibold">
          Mes événements
        </h2>

        {mesEvenements.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-[#6B7280]">
              Aucun événement prévu.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {mesEvenements.map((event) => {
              const lieu = venues.find((v) => v.id === event.lieuId);
              const formation = formations.find(
                (f) => f.id === event.formationId
              );

              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  titre={event.titre}
                  date={event.date}
                  heureDebut={event.heureDebut}
                  heureFin={event.heureFin}
                  lieu={lieu?.nom}
                  formation={formation?.nom}
                  statut={event.statut}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Matériel
        </h2>

        <p className="mt-4 text-[#6B7280]">
          Cette section sera bientôt personnalisée selon les prestations.
        </p>
      </section>
    </main>
  );
}