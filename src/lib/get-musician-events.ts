import { supabase } from "@/lib/supabase";

export async function getMusicianEvents(musicianId: string) {
  const { data, error } = await supabase
    .from("event_musicians")
    .select(
      `
      events (
        id,
        title,
        date,
        start_time,
        end_time,
        status
      )
    `
    )
    .eq("musician_id", musicianId);

  if (error) {
    console.error("Erreur récupération événements musicien :", error);
    return [];
  }

  return (data ?? [])
    .map((item: any) => item.events)
    .filter(Boolean);
}