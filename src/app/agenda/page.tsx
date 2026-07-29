/**
 * Page Agenda — vue calendrier de tous les événements
 */

import { Calendar, MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { getEvents } from "@/lib/get-events";
import { formatDate } from "@/lib/utils";

function formationColor(formation?: string) {
  switch ((formation ?? "").toLowerCase()) {
    case "duo":
      return "bg-emerald-100 text-emerald-700";
    case "trio":
      return "bg-sky-100 text-sky-700";
    case "quartet":
      return "bg-violet-100 text-violet-700";
    case "xxl":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default async function AgendaPage() {
  const sortedEvents = await getEvents();

  return (
    <AppLayout>
      <PageHeader
        title="Agenda"
        subtitle="Tous vos événements à venir"
      />

      <div className="space-y-5">
        {sortedEvents.map((event) => (
          <Card key={event.id} interactive>
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B59B6B]">
                    ÉVÉNEMENT
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#243B53]">
                    {formatDate(event.date)}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${formationColor(
                    event.formation
                  )}`}
                >
                  {event.formation ?? "Formation"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-lg text-[#243B53]">
                <MapPin className="h-5 w-5 text-[#1E6FB8]" />
                <span className="font-medium">
                  {event.location}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}