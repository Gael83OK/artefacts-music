/**
 * Page Agenda — vue calendrier de tous les événements
 */

import { Calendar, MapPin, Clock } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getEvents } from "@/lib/get-events";
import { formatDate } from "@/lib/utils";

export default async function AgendaPage() {
  const sortedEvents = await getEvents();

  return (
    <AppLayout>
      <PageHeader
        title="Agenda"
        subtitle="Tous vos événements à venir"
      />

      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <Card key={event.id} interactive>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {/* Type d'événement */}
            

                <h3 className="text-base font-semibold text-gray-900">
                  {event.title}
                </h3>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>
  {event.start_time} - {event.end_time}
</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              <Badge variant={event.status} label="" />
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
