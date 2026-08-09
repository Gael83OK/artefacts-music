import { supabase } from "@/lib/supabase";

export async function getEventMusicians(eventId: string) {
  const { data, error } = await supabase
    .from("event_musicians")
    .select("musician_id")
    .eq("event_id", eventId);

  if (error) {
    console.error("Erreur récupération musiciens de l'événement :", error);
    return [];
  }

  return data.map((row) => row.musician_id);
}