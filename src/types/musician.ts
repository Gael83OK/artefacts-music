/**
 * Modèle Musicien — membre de l'équipe Artefacts Music
 */

/** Rôles instrumentaux et techniques au sein du groupe */
export type MusicianRole =
  | "Batterie"
  | "Guitare"
  | "Chant"
  | "Claviers"
  | "Basse"
  | "Percussion"
  | "Production"
  | "Ingénieur du son";

/** Noms des formations disponibles */
export type FormationName = "Duo" | "Trio" | "Quartet" | "XXL";

export interface Musician {
  id: string;

  /** Prénom du musicien */
  prenom: string;

  /** Nom de famille (optionnel) */
  nom?: string;

  /** Photo de profil */
  photo?: string;

  /** Rôle principal */
  role: MusicianRole;

  /** Rôles secondaires (ex. Production + Basse) */
  rolesSecondaires?: MusicianRole[];

  /** Ville de résidence */
  ville?: string;

  /** Formations dans lesquelles le musicien peut jouer */
  formationsPossibles: FormationName[];

  /** Musicien actif dans le roster */
  actif: boolean;
}