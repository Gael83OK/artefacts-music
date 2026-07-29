/**
 * Page Prestations — liste des concerts et événements
 */

import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockPrestations } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function PrestationsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Prestations"
        subtitle={`${mockPrestations.length} prestations planifiées`}
      />

      <div className="space-y-4">
        {mockPrestations.map((prestation) => (
          <Card key={prestation.id} interactive>
            {/* Bandeau coloré selon le statut */}
            <div
              className={`mb-4 -mx-6 -mt-6 h-1.5 rounded-t-3xl ${
                prestation.status === "confirmed"
                  ? "bg-gradient-to-r from-mediterranean to-light-blue"
                  : "bg-gradient-to-r from-amber-300 to-amber-400"
              }`}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  {prestation.title}
                </h3>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-mediterranean" />
                    <span>{formatDate(prestation.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-mediterranean" />
                    <span>{prestation.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-mediterranean" />
                    <span className="truncate">{prestation.location}</span>
                  </div>
                  {prestation.musicians && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-3.5 w-3.5 shrink-0 text-mediterranean" />
                      <span>{prestation.musicians.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              <Badge variant={prestation.status} label="" />
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
