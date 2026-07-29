# Artefacts Music

Application professionnelle de gestion pour société de production musicale.

## Fonctionnalités

- **Accueil** — Tableau de bord avec prochain événement, planning hebdomadaire et aperçu matériel
- **Agenda** — Vue calendrier de tous les événements (prestations, répétitions, production, logistique)
- **Prestations** — Gestion des concerts et événements
- **Matériel** — Inventaire et suivi des équipements
- **Profil** — Informations utilisateur, statistiques et équipe

## Stack technique

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- **Lucide React** (icônes)

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Architecture

```
src/
├── app/                  # Pages (App Router)
│   ├── page.tsx          # Accueil
│   ├── agenda/
│   ├── prestations/
│   ├── materiel/
│   └── profil/
├── components/
│   ├── ui/               # Composants réutilisables (Card, Badge, Logo)
│   ├── layout/           # Layout, navigation
│   └── home/             # Composants spécifiques à l'accueil
├── lib/
│   ├── mock-data.ts      # Données fictives
│   ├── utils.ts          # Utilitaires
│   └── constants.ts      # Configuration navigation
└── types/
    └── index.ts          # Types TypeScript
```

## Design

Interface premium inspirée Apple avec palette Artefacts Music :

| Couleur           | Hex       | Usage                |
|-------------------|-----------|----------------------|
| Bleu Méditerranée | `#1E6FB8` | Couleur principale   |
| Bleu clair        | `#7CC6F5` | Accents, fonds       |
| Violet            | `#7A5AF8` | Répétitions          |
| Rose              | `#E96BA8` | Production           |
| Blanc cassé       | `#F8FAFC` | Fond de page         |

## Évolution mobile

Le projet est conçu mobile-first avec :

- Conteneur max-width 512px (format smartphone)
- Barre de navigation inférieure (bottom tab bar)
- Safe area insets pour encoches
- Métadonnées PWA-ready
