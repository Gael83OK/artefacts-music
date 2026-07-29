/**
 * Page Agenda — vue calendrier de tous les événements
 */

import { CalendarDays, MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { getEvents } from "@/lib/get-events";
import { formatDate } from "@/lib/utils";

function formationColor(formation?: string) {
  switch ((formation ?? "").toLowerCase()) {
    case "duo":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "trio":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "quartet":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "xxl":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
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

      <div className="space-y-6">
        {sortedEvents.map((event) => {

          const date = new Date(event.date);

          const day = date.toLocaleDateString("fr-FR", {
            day: "2-digit",
          });

          const month = date
            .toLocaleDateString("fr-FR", {
              month: "short",
            })
            .replace(".", "")
            .toUpperCase();

          const weekday = date.toLocaleDateString("fr-FR", {
            weekday: "long",
          });

          return (

            <Card
              key={event.id}
              interactive
            >

              <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-[#FFFEFC] via-white to-[#FAF7F1] shadow-2xl">

                <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#1E6FB8] via-[#B59B6B] to-[#F5E7C7]" />

                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#B59B6B]/10 blur-3xl" />

                <div className="relative flex items-center gap-7 p-7">

                  <div className="flex w-28 flex-shrink-0 flex-col items-center rounded-[30px] border border-[#ECE3D2] bg-white px-5 py-5 shadow-lg">

                    <span className="text-5xl font-black leading-none text-[#243B53]">
                      {day}
                    </span>

                    <span className="mt-2 text-sm font-bold tracking-[0.30em] text-[#B59B6B]">
                      {month}
                    </span>

                    <div className="mt-4 h-px w-10 bg-[#ECE3D2]" />

                    <span className="mt-3 text-xs font-semibold capitalize text-slate-500">
                      {weekday}
                    </span>

                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B59B6B]">

                          <CalendarDays className="h-4 w-4" />

                          ÉVÉNEMENT

                        </p>

                        <h2 className="text-3xl font-black leading-tight text-[#243B53]">
                          {formatDate(event.date)}
                        </h2>

                      </div>

                      <span
                        className={`rounded-full border px-5 py-2 text-sm font-bold shadow-sm ${formationColor(
                          event.formation
                        )}`}
                      >
                        {event.formation ?? "Formation"}
                      </span>

                    </div>

                    <div className="mt-6 flex items-start gap-4">

<div className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F6F2EA] shadow-sm">

  <MapPin className="h-5 w-5 text-[#B59B6B]" />

</div>

<p className="text-lg font-semibold leading-7 text-[#243B53]">
  {event.location || event.lieu || "Lieu non renseigné"}
</p>

</div>

</div>

</div>

</div>

</Card>

);

})}

</div>

</AppLayout>

);

}