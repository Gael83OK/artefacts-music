"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NouvelEvenementPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("events").insert({
      title,
      date,
      start_time: startTime,
      end_time: endTime,
      notes,
      status: "Confirmé",
    });

    if (error) {
      alert(error.message);
      return;
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
        className="mx-auto max-w-xl space-y-5 rounded-3xl bg-white p-8 shadow-sm"
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
          <label className="mb-2 block font-medium">
            Date
          </label>

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

        <button
          type="submit"
          className="w-full rounded-xl bg-[#1E6FB8] py-3 font-semibold text-white"
        >
          Créer l&apos;événement
        </button>
      </form>
    </main>
  );
}