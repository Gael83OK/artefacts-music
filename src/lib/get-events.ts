import { supabase } from "@/lib/supabase";

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Erreur récupération événements :", error);
    return [];
  }

  return data;
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur récupération événement :", error);
    return null;
  }

  return data;
}