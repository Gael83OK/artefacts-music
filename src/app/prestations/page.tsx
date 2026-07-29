/**
 * Page Prestations — liste des concerts et événements
 */

import { MapPin, Users } from "lucide-react";
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

      <div className="space-y-5">
        {mockPrestations.map((prestation) => (
          <Card
            key={prestation.id}
            interactive
            className="overflow-hidden min-h-[220px]"
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B59B6B]">
                    PRESTATION
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#243B53]">
                    {formatDate(prestation.date)}
                  </h2>
                </div>

                <Badge variant={prestation.status} label="" />
              </div>

              <div className="flex items-center gap-3 text-base text-[#243B53]">
                <MapPin className="h-5 w-5 text-[#1E6FB8]" />
                <span>{prestation.location}</span>
              </div>

              {prestation.musicians && prestation.musicians.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <Users className="h-4 w-4" />
                    Musiciens
                  </div>

                  <div className="flex flex-wrap items-start gap-2">
                    {prestation.musicians.map((musician) => (
                      <span
                        key={musician}
                        className="max-w-full break-words rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                      >
                        {musician}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}