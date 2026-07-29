import { supabase } from "@/lib/supabase";
import type { Musician } from "@/types";

const photos: Record<string, string> = {
  Constantin: "/photos/constantin.jpg",
  Ugo: "/photos/ugo.jpg",
  Liam: "/photos/liam.jpg",
  "Théo": "/photos/theo.jpg",
  Sergio: "/photos/sergio.jpg",
  Julia: "/photos/julia.jpg",
  "Gaël": "/photos/gael.jpg",
  "Joëlle": "/photos/joelle.jpg",
  Atlantine: "/photos/atlantine.jpg",
  Mouz: "/photos/mouz.jpg",
  Antoine: "/photos/antoine.jpg",
  Alexia: "/photos/alexia.jpg",
  Stacy: "/photos/stacy.jpg",
};

export async function getMusicians(): Promise<Musician[]> {
  const { data, error } = await supabase
    .from("musicians")
    .select("*")
    .order("prenom");

  if (error) {
    console.error("Erreur récupération musiciens :", error);
    return [];
  }

  return (data as Musician[]).map((m) => ({
    ...m,
    photo: photos[m.prenom] ?? undefined,
  }));
}