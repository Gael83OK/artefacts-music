/**
 * Base de données fictive Artefacts Music
 *
 * Données structurées selon les modèles métier (src/types).
 * Les exports legacy en bas du fichier alimentent l'interface actuelle
 * en attendant sa migration vers les nouveaux modèles.
 */

import type {
  Musician,
  Formation,
  Venue,
  Event,
  Equipment,
  LegacyEvent,
  LegacyEquipment,
  WeekPlanItem,
  EventType,
} from "@/types";

// ---------------------------------------------------------------------------
// Formations
// ---------------------------------------------------------------------------

export const formations: Formation[] = [
  { id: "form-duo", nom: "Duo", nombreMusiciens: 2 },
  { id: "form-trio", nom: "Trio", nombreMusiciens: 3 },
  { id: "form-quartet", nom: "Quartet", nombreMusiciens: 4 },
  { id: "form-xxl", nom: "XXL", nombreMusiciens: 5 },
];

// ---------------------------------------------------------------------------
// Musiciens — roster officiel Artefacts Music
// ---------------------------------------------------------------------------

export const musicians: Musician[] = [
  {
    id: "mus-constantin",
    prenom: "Constantin",
    photo: "/photos/constantin.jpg",
    role: "Batterie",
    ville: "Rognes",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-ugo",
    prenom: "Ugo",
    photo: "/photos/ugo.jpg",
    role: "Batterie",
    ville: "Avignon",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-liam",
    prenom: "Liam",
    photo: "/photos/liam.jpg",
    role: "Guitare",
    ville: "Nîmes",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-theo",
    prenom: "Théo",
    photo: "/photos/theo.jpg",
    role: "Guitare",
    ville: "Cadenet",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-sergio",
    prenom: "Sergio",
    photo: "/photos/sergio.jpg",
    role: "Production",
    rolesSecondaires: ["Basse"],
    ville: "Avignon",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-julia",
    prenom: "Julia",
    photo: "/photos/julia.jpg",
    role: "Production",
    ville: "Rognes",
    formationsPossibles: [],
    actif: true,
  },
  {
    id: "mus-gael",
    prenom: "Gaël",
    photo: "/photos/gael.jpg",
    role: "Claviers",
    rolesSecondaires: ["Basse"],
    ville: "Hyères",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-joelle",
    prenom: "Joëlle",
    photo: "/photos/joelle.jpg",
    role: "Chant",
    ville: "Bretagne",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-atlantine",
    prenom: "Atlantine",
    photo: "/photos/atlantine.jpg",
    role: "Chant",
    ville: "Cadenet",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-mouz",
    prenom: "Mouz",
    photo: "/photos/mouz.jpg",
    role: "Percussion",
    ville: "Peynier",
    formationsPossibles: ["Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-antoine",
    prenom: "Antoine",
    photo: "/photos/antoine.jpg",
    role: "Ingénieur du son",
    ville: "Marseille",
    formationsPossibles: [],
    actif: true,
  },
  {
    id: "mus-alexia",
    prenom: "Alexia",
    photo: "/photos/alexia.jpg",
    role: "Chant",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
  {
    id: "mus-stacy",
    prenom: "Stacy",
    photo: "/photos/stacy.jpg",
    role: "Chant",
    ville: "Avignon",
    formationsPossibles: ["Duo", "Trio", "Quartet", "XXL"],
    actif: true,
  },
];

// ---------------------------------------------------------------------------
// Lieux
// ---------------------------------------------------------------------------

export const venues: Venue[] = [
  {
    id: "venue-001",
    nom: "Domaine de la Vallée — Mariage",
    type: "Mariage",
    adresse: "Route des Vignes",
    ville: "Aix-en-Provence",
  },
  {
    id: "venue-002",
    nom: "Château Viticole Les Baux",
    type: "Domaine viticole",
    adresse: "Chemin des Oliviers",
    ville: "Les Baux-de-Provence",
  },
  {
    id: "venue-003",
    nom: "Villa privée — Soirée corporate",
    type: "Événement privé",
    adresse: "12 Avenue du Port",
    ville: "Marseille",
  },
  {
    id: "venue-004",
    nom: "Festival Jazz en Provence",
    type: "Événement public",
    adresse: "Parc Jourdan",
    ville: "Aix-en-Provence",
  },
  {
    id: "venue-005",
    nom: "Studio Artefacts",
    type: "Répétition",
    adresse: "Zone artisanale",
    ville: "Rognes",
  },
];

// ---------------------------------------------------------------------------
// Matériel
// ---------------------------------------------------------------------------

export const equipment: Equipment[] = [
  {
    id: "eq-001",
    nom: "Console Yamaha CL5",
    categorie: "Son",
    quantite: 1,
    depot: "Rognes",
    etat: "Disponible",
  },
  {
    id: "eq-002",
    nom: "Micro Shure SM58",
    categorie: "Son",
    quantite: 6,
    depot: "Rognes",
    etat: "Disponible",
  },
  {
    id: "eq-003",
    nom: "Enceinte JBL VRX932",
    categorie: "Son",
    quantite: 4,
    depot: "Rognes",
    etat: "En utilisation",
  },
  {
    id: "eq-004",
    nom: "Pied micro perche",
    categorie: "Accessoires",
    quantite: 8,
    depot: "Rognes",
    etat: "Disponible",
  },
  {
    id: "eq-005",
    nom: "Projecteur LED RGB",
    categorie: "Lumière",
    quantite: 12,
    depot: "Rognes",
    etat: "Maintenance",
  },
  {
    id: "eq-006",
    nom: "Kit batterie complet",
    categorie: "Instruments",
    quantite: 2,
    depot: "Rognes",
    etat: "Disponible",
  },
  {
    id: "eq-007",
    nom: "Clavier Nord Stage 3",
    categorie: "Instruments",
    quantite: 1,
    depot: "Rognes",
    etat: "Disponible",
  },
];

// ---------------------------------------------------------------------------
// Événements
// ---------------------------------------------------------------------------

export const events: Event[] = [
  {
    id: "evt-001",
    titre: "Mariage — Domaine de la Vallée",
    date: "2026-08-15",
    heureDebut: "18:00",
    heureFin: "23:30",
    lieuId: "venue-001",
    formationId: "form-quartet",
    musicienIds: [
      "mus-atlantine",
      "mus-liam",
      "mus-gael",
      "mus-constantin",
    ],
    responsableMaterielId: "mus-sergio",
    responsableRetourMaterielId: "mus-constantin",
    materielAPrevoirIds: ["eq-002", "eq-003", "eq-004", "eq-007"],
    setlist: [
      {
        id: "sl-001",
        titre: "Can't Take My Eyes Off You",
        artiste: "Frankie Valli",
        duree: "3:30",
        ordre: 1,
      },
      {
        id: "sl-002",
        titre: "Valerie",
        artiste: "Amy Winehouse",
        duree: "3:45",
        ordre: 2,
      },
      {
        id: "sl-003",
        titre: "Uptown Funk",
        artiste: "Bruno Mars",
        duree: "4:30",
        ordre: 3,
      },
    ],
    remarques: "Arrivée 16h pour balance. Tenue élégante.",
    statut: "Confirmé",
  },
  {
    id: "evt-002",
    titre: "Soirée viticole — Château Les Baux",
    date: "2026-08-22",
    heureDebut: "19:30",
    heureFin: "00:00",
    lieuId: "venue-002",
    formationId: "form-trio",
    musicienIds: ["mus-stacy", "mus-theo", "mus-ugo"],
    responsableMaterielId: "mus-julia",
    responsableRetourMaterielId: "mus-ugo",
    materielAPrevoirIds: ["eq-002", "eq-004"],
    setlist: [],
    statut: "Confirmé",
  },
  {
    id: "evt-003",
    titre: "Événement corporate — Villa Marseille",
    date: "2026-09-05",
    heureDebut: "19:00",
    heureFin: "22:00",
    lieuId: "venue-003",
    formationId: "form-duo",
    musicienIds: ["mus-alexia", "mus-liam"],
    responsableMaterielId: "mus-sergio",
    responsableRetourMaterielId: "mus-liam",
    materielAPrevoirIds: ["eq-002", "eq-004"],
    setlist: [],
    statut: "En attente",
  },
  {
    id: "evt-004",
    titre: "Festival Jazz en Provence",
    date: "2026-09-12",
    heureDebut: "21:00",
    heureFin: "23:00",
    lieuId: "venue-004",
    formationId: "form-xxl",
    musicienIds: [
      "mus-joelle",
      "mus-liam",
      "mus-theo",
      "mus-gael",
      "mus-mouz",
      "mus-constantin",
    ],
    responsableMaterielId: "mus-antoine",
    responsableRetourMaterielId: "mus-antoine",
    materielAPrevoirIds: ["eq-001", "eq-002", "eq-003", "eq-004", "eq-006"],
    setlist: [],
    remarques: "Prestation XXL — prévoir renfort technique.",
    statut: "En attente",
  },
  {
    id: "evt-005",
    titre: "Répétition générale — Studio Rognes",
    date: "2026-07-28",
    heureDebut: "14:00",
    heureFin: "17:00",
    lieuId: "venue-005",
    formationId: "form-quartet",
    musicienIds: [
      "mus-atlantine",
      "mus-liam",
      "mus-gael",
      "mus-constantin",
    ],
    responsableMaterielId: "mus-sergio",
    responsableRetourMaterielId: "mus-sergio",
    materielAPrevoirIds: ["eq-006", "eq-007"],
    setlist: [],
    statut: "Confirmé",
  },
];

// ---------------------------------------------------------------------------
// Helpers — accès et résolution des relations
// ---------------------------------------------------------------------------

/** Retourne le nom complet d'un musicien */
export function getMusicianDisplayName(musician: Musician): string {
  return musician.nom ? `${musician.prenom} ${musician.nom}` : musician.prenom;
}

/** Retourne tous les rôles d'un musicien (principal + secondaires) */
export function getMusicianRoles(musician: Musician): string {
  const roles = [musician.role, ...(musician.rolesSecondaires ?? [])];
  return roles.join(" / ");
}

/** Trouve un musicien par son id */
export function getMusicianById(id: string): Musician | undefined {
  return musicians.find((m) => m.id === id);
}

/** Trouve une formation par son id */
export function getFormationById(id: string): Formation | undefined {
  return formations.find((f) => f.id === id);
}

/** Trouve un lieu par son id */
export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}

/** Musiciens actifs uniquement */
export function getActiveMusicians(): Musician[] {
  return musicians.filter((m) => m.actif);
}

/** Événements à venir, triés par date */
export function getUpcomingEvents(): Event[] {
  const today = new Date().toISOString().split("T")[0];
  return events
    .filter((e) => e.date >= today && e.statut !== "Terminé")
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Prochain événement confirmé ou en attente */
export function getNextEvent(): Event | undefined {
  return getUpcomingEvents()[0];
}

// ---------------------------------------------------------------------------
// Exports legacy — compatibilité interface actuelle (à supprimer plus tard)
// ---------------------------------------------------------------------------

function mapEventStatus(
  statut: Event["statut"]
): LegacyEvent["status"] {
  switch (statut) {
    case "Confirmé":
      return "confirmed";
    case "En attente":
      return "pending";
    case "Terminé":
      return "confirmed";
  }
}

function mapVenueTypeToEventType(type: Venue["type"]): EventType {
  switch (type) {
    case "Répétition":
      return "repetition";
    default:
      return "prestation";
  }
}

function eventToLegacy(event: Event): LegacyEvent {
  const venue = getVenueById(event.lieuId);
  const musicianNames = event.musicienIds
    .map((id) => getMusicianById(id))
    .filter(Boolean)
    .map((m) => getMusicianDisplayName(m!));

  return {
    id: event.id,
    title: event.titre,
    type: venue ? mapVenueTypeToEventType(venue.type) : "prestation",
    date: event.date,
    time: event.heureDebut,
    location: venue ? `${venue.nom}, ${venue.ville}` : "",
    status: mapEventStatus(event.statut),
    musicians: musicianNames,
  };
}

function equipmentToLegacy(item: Equipment): LegacyEquipment {
  const statusMap: Record<
    Equipment["etat"],
    LegacyEquipment["status"]
  > = {
    Disponible: "available",
    "En utilisation": "in_use",
    Maintenance: "maintenance",
    Indisponible: "maintenance",
  };

  return {
    id: item.id,
    name: item.nom,
    category: item.categorie,
    status: statusMap[item.etat],
    location: item.depot,
  };
}

/** @deprecated Utiliser getNextEvent() */
export const mockNextEvent: LegacyEvent = eventToLegacy(
  getNextEvent() ?? events[0]
);

/** @deprecated Utiliser events et venues */
export const mockWeekPlan: WeekPlanItem[] = [
  {
    id: "wp-1",
    day: "Lundi",
    dayShort: "Lun",
    events: [
      { title: "Répétition générale", time: "14:00", type: "repetition" },
    ],
  },
  {
    id: "wp-2",
    day: "Mardi",
    dayShort: "Mar",
    events: [],
  },
  {
    id: "wp-3",
    day: "Mercredi",
    dayShort: "Mer",
    events: [],
  },
  {
    id: "wp-4",
    day: "Jeudi",
    dayShort: "Jeu",
    events: [],
  },
  {
    id: "wp-5",
    day: "Vendredi",
    dayShort: "Ven",
    events: [],
  },
  {
    id: "wp-6",
    day: "Samedi",
    dayShort: "Sam",
    events: [
      { title: "Mariage — Domaine de la Vallée", time: "18:00", type: "prestation" },
    ],
  },
  {
    id: "wp-7",
    day: "Dimanche",
    dayShort: "Dim",
    events: [],
  },
];

/** @deprecated Utiliser equipment */
export const mockEquipmentSummary = {
  total: equipment.reduce((sum, e) => sum + e.quantite, 0),
  available: equipment
    .filter((e) => e.etat === "Disponible")
    .reduce((sum, e) => sum + e.quantite, 0),
  inUse: equipment
    .filter((e) => e.etat === "En utilisation")
    .reduce((sum, e) => sum + e.quantite, 0),
  maintenance: equipment
    .filter((e) => e.etat === "Maintenance" || e.etat === "Indisponible")
    .reduce((sum, e) => sum + e.quantite, 0),
};

/** @deprecated Utiliser equipment */
export const mockEquipment: LegacyEquipment[] = equipment.map(equipmentToLegacy);

/** @deprecated Utiliser events filtrés par type de lieu */
export const mockPrestations: LegacyEvent[] = events
  .filter((e) => {
    const venue = getVenueById(e.lieuId);
    return venue?.type !== "Répétition";
  })
  .map(eventToLegacy);

/** @deprecated Utiliser events */
export const mockAgendaEvents: LegacyEvent[] = events.map(eventToLegacy);

/** @deprecated Profil fictif — en attente de modèle User */
export const mockUserProfile = {
  name: "Gaël Berlinger",
  role: "Claviers / Production",
  email: "gael@artefacts-music.fr",
  phone: "",
  avatar: null,
  stats: {
    prestationsThisMonth: mockPrestations.filter((p) => p.status === "confirmed")
      .length,
    rehearsalsThisMonth: events.filter((e) => {
      const venue = getVenueById(e.lieuId);
      return venue?.type === "Répétition";
    }).length,
    eventsUpcoming: getUpcomingEvents().length,
  },
};

/** @deprecated Utiliser musicians */
export const mockMusicians = musicians
  .filter((m) => m.actif && m.role !== "Ingénieur du son")
  .map((m) => ({
    id: m.id,
    name: getMusicianDisplayName(m),
    instrument: getMusicianRoles(m),
    email: "",
    phone: "",
  }));
