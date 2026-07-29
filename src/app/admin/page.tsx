import Link from "next/link";
import { getEvents } from "@/lib/repositories/events";
import {
  musicians,
  equipment,
  venues,
} from "@/lib/mock-data";

export default async function AdminPage() {
  const events = await getEvents();

  const cards = [
    {
      title: "Événements",
      count: events.length,
      icon: "📅",
      href: "/admin/nouvel-evenement",
      subtitle: "Créer et gérer les prestations",
    },
    {
      title: "Musiciens",
      count: musicians.length,
      icon: "👥",
      href: "/equipe",
      subtitle: "Gérer l'équipe",
    },
    {
      title: "Matériel",
      count: equipment.length,
      icon: "🎛️",
      href: "/materiel",
      subtitle: "Inventaire et suivi",
    },
    {
      title: "Lieux",
      count: venues.length,
      icon: "📍",
      href: "#",
      subtitle: "Gestion des lieux",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F2E8] p-6 text-[#243B53]">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-[#B59B6B]">
          Artefacts Music
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          👑 Production
        </h1>

        <p className="mt-3 max-w-xl text-[#6B7280]">
          Bienvenue dans le centre de gestion d&apos;Artefacts Music.
        </p>
      </header>

      <div className="grid gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl">{card.icon}</p>

                <h2 className="mt-3 text-2xl font-bold">
                  {card.title}
                </h2>

                <p className="mt-1 text-sm text-[#6B7280]">
                  {card.subtitle}
                </p>
              </div>

              <div className="text-right">
                <p className="text-4xl font-bold text-[#1E6FB8]">
                  {card.count}
                </p>

                <p className="text-sm text-[#6B7280]">
                  éléments
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            📅 Derniers événements
          </h2>

          <Link
            href="/admin/nouvel-evenement"
            className="rounded-xl bg-[#1E6FB8] px-4 py-2 text-sm font-semibold text-white"
          >
            ➕ Nouveau
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="text-[#6B7280]">
            Aucun événement enregistré.
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event: any) => (
              <Link
                key={event.id}
                href={`/admin/evenement/${event.id}`}
                className="block rounded-2xl border border-[#E8E2D7] p-5 transition hover:bg-[#FAF8F4]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-[#6B7280]">
                      📅 {event.date}
                    </p>

                    <p className="text-[#6B7280]">
                      🕒 {event.start_time} → {event.end_time}
                    </p>
                  </div>

                  <div className="text-2xl">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-col gap-4">
        <Link
          href="/admin/nouvel-evenement"
          className="rounded-2xl bg-[#1E6FB8] py-4 text-center text-lg font-semibold text-white transition hover:opacity-90"
        >
          ➕ Nouvel événement
        </Link>

        <Link
          href="/"
          className="rounded-2xl border border-[#D8CDBB] bg-white py-4 text-center font-medium"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}