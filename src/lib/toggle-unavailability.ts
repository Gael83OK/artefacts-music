import { supabase } from "@/lib/supabase";

export async function toggleUnavailability(
  musicianId: string,
  date: Date
) {
  const formattedDate = date.toISOString().split("T")[0];

  const { data } = await supabase
    .from("musician_unavailability")
    .select("*")
    .eq("musician_id", musicianId)
    .eq("unavailable_date", formattedDate)
    .maybeSingle();

  if (data) {
    await supabase
      .from("musician_unavailability")
      .delete()
      .eq("id", data.id);
  } else {
    await supabase
      .from("musician_unavailability")
      .insert({
        musician_id: musicianId,
        unavailable_date: formattedDate,
      });
  }
}