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
    <main className="min-h-screen bg-[#F8F2E8] p-6 text-[#243B53]">
      <header className="mb-10 flex items-center justify-between gap-4">
        <BrandLogo size="lg" priority />

        <div className="min-w-0 text-right">
          <h1 className="text-3xl font-semibold">Artefacts Music</h1>

          <p className="text-sm text-[#6B7280]">
            Gestion des événements & des équipes
          </p>
        </div>
      </header>

      <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold">
          Bonjour 👋
        </h2>

        <p className="text-[#6B7280]">
          Retrouvez vos prochains événements, votre matériel et votre
          organisation.
        </p>
      </section>

      <section className="mb-10">
      <Link
  href="/admin"
  className="block rounded-3xl bg-[#1E6FB8] p-6 text-center text-xl font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
>
  👑 Accéder à l&apos;espace Production
</Link>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">
          Sélectionnez votre profil
        </h2>

        <p className="mb-6 text-[#6B7280]">
          Accédez à vos événements, votre matériel, vos informations et votre
          planning.
        </p>

        <div className="space-y-5">
          {musicians.map((musician) => (
            <Link
              key={musician.id}
              href={`/profil/${musician.id}`}
              className="group flex items-center gap-5 rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md">
                {musician.photo ? (
                  <Image
                    src={musician.photo}
                    alt={musician.prenom}
                    width={72}
                    height={72}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center text-2xl font-bold ${avatarColor(
                      musician.role
                    )}`}
                  >
                    {musician.prenom.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-2xl font-semibold transition-colors group-hover:text-[#1E6FB8]">
                  {musician.prenom}
                </h3>

                <div className="mt-2">
                  <span className="inline-flex rounded-full bg-[#EEF4FB] px-3 py-1 text-xs font-semibold text-[#1E6FB8]">
                    {musician.role}
                  </span>
                </div>

                {musician.ville && (
                  <p className="mt-3 text-sm text-gray-500">
                    📍 {musician.ville}
                  </p>
                )}
              </div>

              <div className="text-2xl text-gray-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#1E6FB8]">
                ›
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}