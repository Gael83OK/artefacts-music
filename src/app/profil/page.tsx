import Link from "next/link";
import { musicians } from "@/lib/mock-data";
import { BrandLogo } from "@/components/brand";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F2E8] p-8 text-[#243B53]">
      <header className="mb-10 flex items-center justify-between">
        <BrandLogo size="lg" priority />

        <div className="text-right">
          <h1 className="text-3xl font-semibold">
            Artefacts Music
          </h1>

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
          Retrouvez vos prochains événements, votre matériel et votre organisation.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">
          Sélectionnez votre profil
        </h2>

        <p className="mb-6 text-[#6B7280]">
          Accédez à vos événements, votre matériel, vos informations et votre planning.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {musicians.map((musician) => (
            <Link
              key={musician.id}
              href={`/profil/${musician.id}`}
              className="block rounded-2xl bg-white p-5 shadow-sm transition hover:scale-[1.02] hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">
                {musician.prenom}
              </h3>

              <p className="mt-1 text-sm text-[#6B7280]">
                {musician.role}
              </p>

              {musician.ville && (
                <p className="mt-3 text-sm">
                  📍 {musician.ville}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}