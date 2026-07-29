/**
 * Page Matériel — catégories d'inventaire
 */

import Link from "next/link";
import { Speaker, Lightbulb, Package } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";

const categories = [
  {
    title: "Son",
    slug: "son",
    icon: Speaker,
    color: "bg-sky-100 text-sky-700",
  },
  {
    title: "Lumières",
    slug: "lumieres",
    icon: Lightbulb,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Autres",
    slug: "autres",
    icon: Package,
    color: "bg-slate-100 text-slate-700",
  },
];

export default function MaterielPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Matériel"
        subtitle="Choisissez une catégorie"
      />

      <div className="space-y-5">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.slug}
              href={`/materiel/${category.slug}`}
              className="block"
            >
              <Card interactive>
                <div className="flex items-center gap-5 py-2">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-3xl ${category.color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#243B53]">
                      {category.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Consulter l'inventaire
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}