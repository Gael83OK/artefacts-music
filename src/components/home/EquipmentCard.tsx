/**
 * Carte "Matériel" — aperçu rapide de l'inventaire
 */

import { Package, CheckCircle, Wrench, Truck } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { mockEquipmentSummary } from "@/lib/mock-data";

export function EquipmentCard() {
  const { total, available, inUse, maintenance } = mockEquipmentSummary;

  const stats = [
    {
      label: "Disponible",
      value: available,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "En utilisation",
      value: inUse,
      icon: Truck,
      color: "text-mediterranean bg-mediterranean/10",
    },
    {
      label: "Maintenance",
      value: maintenance,
      icon: Wrench,
      color: "text-rose bg-rose/10",
    },
  ];

  return (
    <Link href="/materiel">
      <Card interactive>
        <CardHeader
          title="Matériel"
          subtitle={`${total} équipements au total`}
          action={
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-light-blue/20">
              <Package className="h-5 w-5 text-mediterranean" />
            </div>
          }
        />

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-2xl bg-offwhite p-3"
              >
                <div
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-[10px] text-gray-500">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </Link>
  );
}
