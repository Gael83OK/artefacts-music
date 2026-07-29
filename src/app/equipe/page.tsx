import Link from "next/link";
import Image from "next/image";
import { MapPin, User, ChevronRight } from "lucide-react";
import { getMusicians } from "@/lib/get-musicians";

export default async function EquipePage() {
  const musicians = await getMusicians();

  return (
    <main className="min-h-screen bg-[#F8F2E8] p-8 text-[#243B53]">
      <header className="mx-auto mb-10 max-w-6xl">
        <h1 className="text-4xl font-bold">
          Équipe Artefacts Music
        </h1>

        <p className="mt-2 text-gray-500">
          Les artistes et techniciens du groupe.
        </p>
      </header>

      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        {musicians.map((musician) => (
          <Link
            key={musician.id}
            href={`/profil/${musician.id}`}
            className="group"
          >
            <article className="rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-[#1E6FB8]/20">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                {musician.photo ? (
                  <Image
                  src={musician.photo}
                  alt={musician.prenom}
                  width={100}
                  height={100}
                  className="mx-auto h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-[#EEF4FB] sm:mx-0"
                />
                ) : (
                 <div className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#EEF4FB] sm:mx-0">
                    <User
                      size={42}
                      className="text-[#1E6FB8]"
                    />
                  </div>
                )}

                <div className="flex-1">

                  <div className="flex items-start justify-between">

                    <div>

                      <h2 className="text-2xl font-bold">
                        {musician.prenom}
                      </h2>

                      <p className="mt-1 text-[#1E6FB8] font-semibold">
                        {musician.role}
                      </p>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        musician.actif
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {musician.actif ? "Disponible" : "Indisponible"}
                    </span>

                  </div>

                  {musician.ville && (
                    <div className="mt-4 flex items-center gap-2 text-gray-500">
                      <MapPin size={16} />
                      <span>{musician.ville}</span>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t pt-4">

                    <span className="text-sm text-gray-500">
                      Voir la fiche
                    </span>

                    <ChevronRight
                      size={20}
                      className="text-[#1E6FB8] transition-transform group-hover:translate-x-1"
                    />

                  </div>

                </div>

              </div>

            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}