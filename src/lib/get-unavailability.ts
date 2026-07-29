import { supabase } from "@/lib/supabase";

export async function getUnavailableDates(musicianId: string) {
  const { data, error } = await supabase
    .from("musician_unavailability")
    .select("unavailable_date")
    .eq("musician_id", musicianId)
    .order("unavailable_date");

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((item) => new Date(item.unavailable_date));
}