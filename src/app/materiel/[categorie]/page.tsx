import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { equipment } from "@/lib/mock-data";

const categories: Record<string, string[]> = {
  son: ["Son"],
  lumieres: ["Lumière"],
  autres: ["Accessoires", "Instruments"],
};

export default async function MaterielCategoriePage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;

  const allowed = categories[categorie];

  if (!allowed) notFound();

  const items = equipment.filter((item) =>
    allowed.includes(item.categorie)
  );

  return (
    <AppLayout>
      <PageHeader
        title={categorie.charAt(0).toUpperCase() + categorie.slice(1)}
        subtitle={`${items.length} élément(s)`}
      />

      <Link
        href="/materiel"
        className="mb-5 flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#243B53]">
                  {item.nom}
                </h3>

                <p className="text-sm text-gray-500">
                  x{item.quantite}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  item.etat === "Disponible"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {item.etat === "Disponible"
                  ? "Disponible"
                  : "Maintenance"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}