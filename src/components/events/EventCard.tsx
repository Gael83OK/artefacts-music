import Link from "next/link";

interface EventCardProps {
  id: string;
  titre: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  lieu?: string;
  formation?: string;
  statut: string;
}

export function EventCard({
  id,
  titre,
  date,
  heureDebut,
  heureFin,
  lieu,
  formation,
  statut,
}: EventCardProps) {
  const statutColor =
    statut === "Confirmé"
      ? "bg-green-100 text-green-700"
      : statut === "En attente"
      ? "bg-orange-100 text-orange-700"
      : "bg-gray-100 text-gray-700";

  const dateFormatee = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/evenement/${id}`}
      className="block rounded-3xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-[#243B53]">
          {titre}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statutColor}`}
        >
          {statut}
        </span>
      </div>

      <p className="mt-4 text-sm text-[#6B7280]">
        📅 {dateFormatee}
      </p>

      <p className="mt-2 text-sm">
        🕒 {heureDebut} – {heureFin}
      </p>

      {lieu && (
        <p className="mt-2 text-sm">
          📍 {lieu}
        </p>
      )}

      {formation && (
        <p className="mt-2 text-sm">
          👥 {formation}
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <span className="text-[#1E6FB8] font-medium">
          Voir les détails →
        </span>
      </div>
    </Link>
  );
}