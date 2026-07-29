/**
 * Carte "Prochain événement" — affichée sur la page d'accueil
 */

import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockNextEvent } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export function NextEventCard() {
  const event = mockNextEvent;

  return (
    <Card className="overflow-hidden">
      {/* Bandeau dégradé en haut de la carte */}
      <div className="mb-4 -mx-6 -mt-6 h-2 bg-gradient-to-r from-mediterranean via-violet to-rose" />

      <CardHeader
        title="Prochain événement"
        action={<Badge variant={event.status} label="Confirmé" />}
      />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="h-4 w-4 shrink-0 text-mediterranean" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="h-4 w-4 shrink-0 text-mediterranean" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin className="h-4 w-4 shrink-0 text-mediterranean" />
            <span>{event.location}</span>
          </div>

          {event.musicians && event.musicians.length > 0 && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="h-4 w-4 shrink-0 text-mediterranean" />
              <span>{event.musicians.join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
