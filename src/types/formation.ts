/**
 * Modèle Formation — composition du groupe pour une prestation
 */

import type { FormationName } from "./musician";

export interface Formation {
  id: string;
  nom: FormationName;
  /** Nombre de musiciens requis pour cette formation */
  nombreMusiciens: number;
}
