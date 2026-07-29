"use client";

import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface AvailabilityCalendarProps {
  unavailableDates: Date[];
}

export default function AvailabilityCalendar({
  unavailableDates,
}: AvailabilityCalendarProps) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold">
      Mes indisponibilités
      </h2>

      <p className="mb-4 text-sm text-gray-500">
        Cliquez sur une date pour la marquer indisponible.
      </p>

      <DayPicker
        locale={fr}
        mode="multiple"
        selected={unavailableDates}
        modifiers={{
          unavailable: unavailableDates,
        }}
        modifiersClassNames={{
          unavailable:
            "bg-red-500 text-white rounded-full font-bold",
        }}
      />
    </div>
  );
}