"use client";

import { useState } from "react";

type Musician = {
  id: string;
  prenom: string;
  role: string;
};

type Props = {
  eventId: string;
  musicians: Musician[];
  selectedMusicians?: string[];
};

export default function EventMusicians({
  eventId,
  musicians,
  selectedMusicians = [],
}: Props) {
  const [selected, setSelected] = useState<string[]>(selectedMusicians);
  const [saving, setSaving] = useState(false);

  function toggleMusician(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((m) => m !== id)
        : [...current, id]
    );
  }

  async function save() {
    setSaving(true);

    const response = await fetch("/api/event-musicians", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId,
        musicianIds: selected,
      }),
    });

    setSaving(false);

    if (response.ok) {
      alert("✅ Musiciens enregistrés");
    } else {
      alert("❌ Erreur lors de l'enregistrement");
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">
        👥 Musiciens
      </h2>

      <div className="space-y-3">
        {musicians.map((musician) => (
          <label
            key={musician.id}
            className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-4 cursor-pointer"
          >
            <div>
              <p className="font-semibold">
                {musician.prenom}
              </p>

              <p className="text-sm text-[#6B7280]">
                {musician.role}
              </p>
            </div>

            <input
              type="checkbox"
              checked={selected.includes(musician.id)}
              onChange={() => toggleMusician(musician.id)}
              className="h-5 w-5"
            />
          </label>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 w-full rounded-2xl bg-[#1E6FB8] py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "💾 Enregistrer les musiciens"}
      </button>
    </div>
  );
}