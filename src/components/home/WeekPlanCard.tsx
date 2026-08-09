/**
 * Carte "Planning de la semaine" — vue condensée du calendrier
 */

import { Card, CardHeader } from "@/components/ui/Card";
import { mockWeekPlan } from "@/lib/mock-data";
import { eventTypeColors } from "@/lib/utils";

export function WeekPlanCard() {
  return (
    <Card>
      <CardHeader title="Planning de la semaine" subtitle="28 juil. — 3 août 2026" />

      <div className="space-y-3">
        {mockWeekPlan.map((day) => (
          <div
            key={day.id}
            className="flex items-start gap-3 rounded-2xl bg-offwhite p-3"
          >
            {/* Jour de la semaine */}
            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-white shadow-sm">
              <span className="text-[10px] font-medium uppercase text-gray-400">
                {day.dayShort}
              </span>
            </div>

            {/* Événements du jour */}
            <div className="min-w-0 flex-1">
              {day.events.length === 0 ? (
                <p className="py-2 text-sm text-gray-400">Aucun événement</p>
              ) : (
                <div className="space-y-1.5">
                  {day.events.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400">
                        {event.time}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${eventTypeColors[event.type]}`}
                      >
                        {event.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
