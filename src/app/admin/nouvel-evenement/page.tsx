"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Musician } from "@/types";
import { useRouter } from "next/navigation";

export default function NouvelEvenementPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [selectedMusicians, setSelectedMusicians] = useState<string[]>([]);

  const [busyMusicians, setBusyMusicians] = useState<string[]>([]);
  const [busyEvents, setBusyEvents] = useState<Record<string, string>>({});


useEffect(() => {

  async function loadMusicians() {
    const { data, error } = await supabase
      .from("musicians")
      .select("*")
      .order("prenom");

    if (!error && data) {
      setMusicians((data ?? []) as Musician[]);
    }
  }

  loadMusicians();
}, []);

useEffect(() => {
  async function loadBusyMusicians() {
    if (!date) {
      setBusyMusicians([]);
      setBusyEvents({});
      return;
    }

    const { data: events } = await supabase
      .from("events")
      .select("id, title")
      .eq("date", date);

    if (!events || events.length === 0) {
      setBusyMusicians([]);
      setBusyEvents({});
      return;
    }

    const eventIds = events.map((e) => e.id);

    const { data: links } = await supabase
      .from("event_musicians")
      .select("musician_id, event_id")
      .in("event_id", eventIds);

    if (!links) {
      setBusyMusicians([]);
      setBusyEvents({});
      return;
    }

    const busyIds = links.map((l) => l.musician_id);

    const names: Record<string, string> = {};

    links.forEach((link) => {
      const event = events.find((e) => e.id === link.event_id);

      if (event) {
        names[link.musician_id] = event.title;
      }
    });

    setBusyMusicians(busyIds);
    setBusyEvents(names);
  }

  loadBusyMusicians();
}, [date]);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title,
      date,
      start_time: startTime,
      end_time: endTime,
      notes,
      status: "Confirmé",
    })
    .select()
    .single();

  if (error || !event) {
    alert(error?.message ?? "Erreur lors de la création");
    return;
  }

  if (selectedMusicians.length > 0) {
    const links = selectedMusicians.map((musicianId) => ({
      event_id: event.id,
      musician_id: musicianId,
    }));

    const { error: linkError } = await supabase
      .from("event_musicians")
      .insert(links);

    if (linkError) {
      alert(linkError.message);
      return;
    }
  }

  alert("Événement créé avec succès !");

  router.push("/admin");
}

  return (
    <main className="min-h-screen bg-[#F8F2E8] p-8 text-[#243B53]">
      <h1 className="mb-8 text-4xl font-bold">
        Nouvel événement
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl space-y-6 rounded-3xl bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-2 block font-medium">
            Titre
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />
        </div>

        <div>
        <p className="mb-2 text-sm text-gray-500">
  {selectedMusicians.length} musicien(s) sélectionné(s)
</p>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block font-medium">
              Début
            </label>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Fin
            </label>

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border p-3"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Remarques
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border p-3"
            rows={5}
          />
        </div>
        <div>
  <label className="mb-3 block font-medium">
    Musiciens présents
  </label>

  <div className="grid gap-4 md:grid-cols-2">
  {musicians.map((musician) => {
    const busy = busyMusicians.includes(musician.id);

    return (
      <label
        key={musician.id}
        className={`cursor-pointer rounded-2xl border p-5 transition-all ${
          busy
            ? "cursor-not-allowed border-red-200 bg-red-50 opacity-70"
            : selectedMusicians.includes(musician.id)
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200 bg-white hover:border-blue-400 hover:shadow-md"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {musician.prenom}
            </h3>

            <p className="text-sm text-gray-500">
              {musician.role}
            </p>

            {busy && (
              <p className="mt-2 text-sm font-medium text-red-600">
                🔴 Déjà occupé
              </p>
            )}

            {busy && (
              <p className="text-sm text-red-500">
                {busyEvents[musician.id]}
              </p>
            )}
          </div>

          <input
            type="checkbox"
            disabled={busy}
            checked={selectedMusicians.includes(musician.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedMusicians((prev) => [
                  ...prev,
                  musician.id,
                ]);
              } else {
                setSelectedMusicians((prev) =>
                  prev.filter((id) => id !== musician.id)
                );
              }
            }}
            className="h-5 w-5"
          />
        </div>
      </label>
    );
  })}
</div>
</div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[#1E6FB8] py-3 font-semibold text-white"
        >
          Créer l'événement
        </button>
      </form>
    </main>
  );
}