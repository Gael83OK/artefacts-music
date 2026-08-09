import { supabase } from "@/lib/supabase";
import type { Musician } from "@/types";

export async function getMusicians(): Promise<Musician[]> {
  const { data, error } = await supabase
    .from("musicians")
    .select("*")
    .order("prenom");

  if (error) {
    console.error("Erreur récupération musiciens :", error);
    return [];
  }

  return data as Musician[];
}