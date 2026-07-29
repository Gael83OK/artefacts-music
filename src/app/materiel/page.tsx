/**
 * Page Matériel — inventaire et statut des équipements
 */

import { Package, MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockEquipment, mockEquipmentSummary } from "@/lib/mock-data";

/** Labels français pour les catégories de matériel */
const categoryLabels: Record<string, string> = {
  Son: "🔊 Son",
  Lumière: "💡 Lumière",
  Accessoires: "🔧 Accessoires",
};

export default function MaterielPage() {
  const { total, available, inUse, maintenance } = mockEquipmentSummary;

  return (
    <AppLayout>
      <PageHeader
        title="Matériel"
        subtitle="Gestion de l'inventaire"
      />

      {/* Résumé en haut de page */}
      <div className="mb-6 grid grid-cols-4 gap-2">
        {[
          { label: "Total", value: total, color: "text-gray-900" },
          { label: "Dispo.", value: available, color: "text-green-600" },
          { label: "En cours", value: inUse, color: "text-mediterranean" },
          { label: "Maint.", value: maintenance, color: "text-rose" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-2xl bg-white p-3 shadow-card"
          >
            <span className={`text-xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
            <span className="text-[10px] text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Liste des équipements */}
      <div className="space-y-3">
        {mockEquipment.map((item) => (
          <Card key={item.id} interactive>
            <div className="flex items-center gap-4">
              {/* Icône catégorie */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-light-blue/20">
                <Package className="h-6 w-6 text-mediterranean" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {categoryLabels[item.category] || item.category}
                    </p>
                  </div>
                  <Badge variant={item.status} label="" />
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
