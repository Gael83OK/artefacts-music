import { supabase } from "@/lib/supabase";
import { musicians } from "@/lib/mock-data";

export async function importMusicians() {
  // Récupère les musiciens déjà présents
  const { data: existing } = await supabase
    .from("musicians")
    .select("prenom");

  const existingNames = new Set(
    (existing ?? []).map((m) => m.prenom)
  );

  // Garde uniquement ceux qui n'existent pas encore
  const toImport = musicians
    .filter((m) => !existingNames.has(m.prenom))
    .map((musician) => ({
      prenom: musician.prenom,
      role: musician.role,
      ville: musician.ville ?? null,
      actif: musician.actif,
    }));

  if (toImport.length === 0) {
    console.log("Tous les musiciens sont déjà importés.");
    return;
  }

  const { data, error } = await supabase
    .from("musicians")
    .insert(toImport)
    .select();

  if (error) {
    console.error("Erreur import musiciens :", error);
    return;
  }

  console.log(`${data.length} musiciens importés.`);
}