import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { eventId, musicianIds } = await request.json();

    if (!eventId || !Array.isArray(musicianIds)) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 }
      );
    }

    // Supprime les anciennes affectations
    const { error: deleteError } = await supabase
      .from("event_musicians")
      .delete()
      .eq("event_id", eventId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    // S'il n'y a aucun musicien sélectionné, on s'arrête ici
    if (musicianIds.length === 0) {
      return NextResponse.json({ success: true });
    }

    // Prépare les nouvelles affectations
    const rows = musicianIds.map((musicianId: string) => ({
      event_id: eventId,
      musician_id: musicianId,
    }));

    const { error: insertError } = await supabase
      .from("event_musicians")
      .insert(rows);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}