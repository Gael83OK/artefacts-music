import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/brand";
import { getMusicians } from "@/lib/get-musicians";

function avatarColor(role: string | null | undefined) {
  const r = (role ?? "").toLowerCase();

  if (r.includes("chant")) return "bg-violet-100 text-violet-700";
  if (r.includes("piano") || r.includes("clavier"))
    return "bg-blue-100 text-blue-700";
  if (r.includes("batt")) return "bg-orange-100 text-orange-700";
  if (r.includes("guit")) return "bg-emerald-100 text-emerald-700";
  if (r.includes("basse")) return "bg-teal-100 text-teal-700";
  if (r.includes("sax")) return "bg-red-100 text-red-700";
  if (r.includes("trom")) return "bg-yellow-100 text-yellow-700";

  return "bg-slate-200 text-slate-700";
}

export default async function Home() {
  const musicians = await getMusicians();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#F8F2E8] to-[#EEF5FD] p-6 text-[#243B53]">

      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />

      <header className="relative mb-10">

        <div className="flex items-center gap-5 rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-2xl backdrop-blur-xl">

          <div className="rounded-3xl bg-white p-3 shadow-xl">
            <BrandLogo size="lg" priority />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tight">
              Artefacts Music
            </h1>

            <p className="mt-2 text-base text-slate-500">
              Gestion des équipes • Concerts • Production
            </p>
          </div>

        </div>

      </header>

      <section className="relative mb-8 overflow-hidden rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">

        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-60" />

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#1E6FB8]">
          Tableau de bord
        </p>

        <h2 className="text-4xl font-black leading-tight">
          Bonjour 👋
        </h2>

        <p className="mt-4 max-w-md text-lg leading-8 text-slate-600">
          Retrouvez vos événements, vos musiciens, votre matériel et toute
          l'organisation du groupe depuis une seule application.
        </p>

      </section>

      <section className="mb-12">

        <Link
          href="/admin"
          className="group relative block overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0F5DAA] via-[#1E6FB8] to-[#4D9FFF] p-7 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-300/50"
        >

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">
                Production
              </p>

              <h2 className="text-3xl font-black text-white">
                Espace Administration
              </h2>

              <p className="mt-2 text-blue-100">
                Planning • Prestations • Gestion du groupe
              </p>

            </div>

            <div className="text-5xl transition-transform duration-300 group-hover:translate-x-2">
              👑
            </div>

          </div>

        </Link>

      </section>
      
      <section>

        <div className="mb-8">

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#1E6FB8]">
            Musiciens
          </p>

          <h2 className="text-4xl font-black tracking-tight">
            Choisissez votre profil
          </h2>

          <p className="mt-3 max-w-lg text-lg leading-8 text-slate-500">
            Retrouvez votre planning, vos prestations, votre matériel et toutes
            les informations de l'équipe.
          </p>

        </div>

        <div className="space-y-6">

          {musicians.map((musician) => (

            <Link
              key={musician.id}
              href={`/profil/${musician.id}`}
              className="group relative block overflow-hidden rounded-[34px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl"
            >

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#1E6FB8]/5 blur-3xl transition-all duration-300 group-hover:bg-[#1E6FB8]/15" />

              <div className="relative flex items-center gap-6">

                <div className="relative">

                  <div className="absolute inset-0 rounded-full bg-[#1E6FB8]/20 blur-lg transition-all duration-300 group-hover:scale-125" />

                  <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full ring-4 ring-white shadow-xl">

                    {musician.photo ? (

                      <Image
                        src={musician.photo}
                        alt={musician.prenom}
                        width={84}
                        height={84}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />

                    ) : (

                      <div
                        className={`flex h-full w-full items-center justify-center text-3xl font-black ${avatarColor(
                          musician.role
                        )}`}
                      >
                        {musician.prenom.charAt(0).toUpperCase()}
                      </div>

                    )}

                  </div>

                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="truncate text-[30px] font-black tracking-tight transition-colors duration-300 group-hover:text-[#1E6FB8]">
                    {musician.prenom}
                  </h3>

                  <div className="mt-3">

                    <span className="inline-flex rounded-full bg-gradient-to-r from-[#EAF3FF] to-[#F5F9FF] px-4 py-2 text-sm font-bold text-[#1E6FB8] shadow-sm">
                      {musician.role}
                    </span>

                  </div>

                  {musician.ville && (

                    <p className="mt-4 flex items-center gap-2 text-base text-slate-500">

                      <span>📍</span>

                      <span>{musician.ville}</span>

                    </p>

                  )}

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F8FD] text-3xl text-[#1E6FB8] transition-all duration-300 group-hover:translate-x-2 group-hover:bg-[#1E6FB8] group-hover:text-white">

                  →

                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>

  );

}