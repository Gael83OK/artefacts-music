import { notFound } from "next/navigation";
import {
  events,
  musicians,
  venues,
  formations,
  equipment,
} from "@/lib/mock-data";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;

  const event = events.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const lieu = venues.find((v) => v.id === event.lieuId);
  const formation = formations.find((f) => f.id === event.formationId);

  const participants = musicians.filter((m) =>
    event.musicienIds.includes(m.id)
  );

  const materiel = equipment.filter((e) =>
    event.materielAPrevoirIds.includes(e.id)
  );

  return (
    <main className="min-h-screen bg-[#F8F2E8] p-8 text-[#243B53]">
      <h1 className="text-3xl font-bold">{event.titre}</h1>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <p>📅 {event.date}</p>
        <p>🕒 {event.heureDebut} - {event.heureFin}</p>

        {lieu && (
          <>
            <p className="mt-3 font-semibold">{lieu.nom}</p>
            <p>{lieu.adresse}</p>
            <p>{lieu.ville}</p>
          </>
        )}

        {formation && (
          <p className="mt-3">
            👥 Formation : <strong>{formation.nom}</strong>
          </p>
        )}

        <p className="mt-3">
          Statut : <strong>{event.statut}</strong>
        </p>
      </div>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Musiciens présents
        </h2>

        <div className="space-y-2">
          {participants.map((m) => (
            <div key={m.id}>
              • {m.prenom} — {m.role}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Matériel à prévoir
        </h2>

        <div className="space-y-2">
          {materiel.map((item) => (
            <div key={item.id}>
              • {item.nom}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Setlist
        </h2>

        {event.setlist.length === 0 ? (
          <p>Aucune setlist.</p>
        ) : (
          <ol className="list-decimal pl-5 space-y-2">
            {event.setlist.map((song) => (
              <li key={song.id}>
                <strong>{song.titre}</strong> — {song.artiste}
              </li>
            ))}
          </ol>
        )}
      </section>

      {event.remarques && (
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Remarques
          </h2>

          <p>{event.remarques}</p>
        </section>
      )}
    </main>
  );
}