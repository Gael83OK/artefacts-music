import { Setlist } from "@/types/setlist";

export const INITIAL_MOCK_SETLISTS: Setlist[] = [
  {
    id: "setlist-prest-1",
    prestationId: "prest-1", // Mariage Émilie & Marc (Château de Cassis)
    statut: "publiee",
    items: [
      {
        id: "item-101",
        songId: "song-1", // L-O-V-E
        ordre: 1,
        isDemandeClient: false,
        notes: "Ouverture du vin d'honneur — Tempo modéré.",
      },
      {
        id: "item-102",
        songId: "song-2", // Fly Me to the Moon
        ordre: 2,
        isDemandeClient: false,
      },
      {
        id: "item-103",
        songId: "song-3", // Ain't No Mountain High Enough
        ordre: 3,
        isDemandeClient: true, // Demande particulière des Mariés !
        notes: "Demande spéciale mariés pour l'entrée des témoins.",
      },
      {
        id: "item-104",
        songId: "song-5", // Valerie
        ordre: 4,
        isDemandeClient: false,
      },
    ],
    irealFile: {
      id: "ireal-101",
      nom: "Setlist_Mariage_Cassis_Quartet.html",
      content: `<!DOCTYPE html>
<html>
<head><title>Setlist iReal Pro — Mariage Cassis</title></head>
<body>
  <h1>Setlist iReal Pro — Mariage Émilie & Marc</h1>
  <p>Format HTML exporté directement depuis iReal Pro.</p>
  <ul>
    <li>L-O-V-E - G</li>
    <li>Fly Me To The Moon - C-</li>
    <li>Ain't No Mountain High Enough - D</li>
    <li>Valerie - Eb</li>
  </ul>
</body>
</html>`,
      importedAt: "2026-08-08T16:00:00Z",
      importedBy: "Constantin Lau",
    },
    updatedAt: "2026-08-08T16:00:00Z",
    updatedBy: "Constantin Lau",
  },
];
