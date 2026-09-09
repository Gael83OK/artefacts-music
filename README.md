# Artefacts Music — Guide de Transmission Développeur

Application web et mobile premium de gestion pour la société de production musicale **Artefacts Music**.

---

## 🚀 Démarrage Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement local
npm run dev

# 3. Vérifier le type checking TypeScript
npx tsc --noEmit

# 4. Vérifier la compilation et le build de production
npm run build
```

Accès local : [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Stack Technique

- **Framework** : Next.js 15.5 (App Router)
- **Bibliothèque UI** : React 19
- **Langage** : TypeScript 5 (Mode strict, 0 erreur de type)
- **Styling** : Tailwind CSS 3 + Vanilla CSS Variables (Dark Theme Premium & Glassmorphism)
- **Icônes** : Lucide React
- **Hébergement & Déploiement** : Vercel (Intégration continue via GitHub)

---

## 📐 Architecture du Projet

```
src/
├── app/                      # Routes & Pages (App Router Next.js 15)
│   ├── globals.css           # Thème global (CSS variables dark mode & classes glass)
│   ├── page.tsx              # Accueil / Dashboard (Sélecteur profil, prochain event)
│   ├── calendrier/           # Agenda & Planning des événements
│   ├── espace-musical/       # Répertoire des 121 morceaux Artefacts (A-Z)
│   ├── prestations/          # Suivi des dates et prestations
│   ├── materiel/             # Gestion et inventaire du parc matériel
│   ├── repetitions/          # Organisation des sessions de répétition
│   ├── documents/            # Espace documentaire & fiches de paie
│   ├── annuaire/             # Annuaire des musiciens et techniciens
│   └── profil/               # Espace profil utilisateur & paramètres
├── components/
│   ├── ui/                   # Composants UI réutilisables (Button, Card, Badge, Avatar, Modal...)
│   ├── layout/               # Header, Sidebar, BottomNavigation (Mobile)
│   ├── home/                 # Composants d'accueil (UserSpaceSelector, UpcomingEvent...)
│   ├── auth/                 # Formulaires de connexion et changement de profil
│   └── materiel/             # Modales et formulaires matériel
├── context/
│   └── AuthContext.tsx       # Gestion de la session utilisateur & switch de profils
├── lib/
│   ├── mock-users.ts         # Profils utilisateurs Artefacts
│   ├── mock-songs.ts         # Répertoire complet (121 morceaux triés + tonalités)
│   ├── mock-events.ts        # Événements et planning test
│   ├── mock-materiel.ts      # Données de test matériel
│   └── utils.ts              # Utilitaires (cn, formateurs de dates...)
└── types/
    ├── index.ts              # Export centralisé des types
    ├── song.ts               # Types Chansons & Répertoire
    ├── user.ts               # Types Musiciens & Profils
    └── navigation.ts         # Types Navigation & Icônes
```

---

## 🎨 Système de Design & Thème

Le projet utilise un **Dark Mode Premium** basé sur des variables CSS dans `src/app/globals.css` :

| Variable | Valeur | Rôle / Usage |
|---|---|---|
| `--bg-base` | `#0D0B18` | Fond principal de l'application |
| `--bg-surface` | `#141220` | Containers & barres de navigation |
| `--bg-card` | `#252139` | Cartes & panneaux interactifs |
| `--text-primary` | `#FFFFFF` | Titres, noms et informations prioritaires |
| `--text-secondary` | `#D4CFEC` | Sous-titres, détails et artistes |
| `--text-muted` | `#9D98BC` | Métadonnées et labels secondaires |
| `--accent-violet` | `#8B6DFA` | Événements, badges et actions principales |

### Utilitaires Glassmorphism :
- `.glass-card` : Cartes translucides avec flou d'arrière-plan.
- `.glass-panel` : Panneaux d'interface et filtres.

---

## 🔐 Gestion des Utilisateurs (Auth)

La gestion des utilisateurs repose sur `AuthContext.tsx` avec des profils pré-configurés dans `src/lib/mock-users.ts` (Musiciens, Techniciens, Production). Le composant `UserSpaceSelector` sur la page d'accueil permet de simuler le basculement d'utilisateur instantanément.

---

## 📦 Déploiement Vercel

- **Dépôt Git** : Synchronisé avec GitHub (`main`).
- **Déploiement Automatique** : Chaque `git push` sur `main` déclenche un build de production sur Vercel.
- **Validation avant Push** : Toujours exécuter `npm run build` localement avant de pousser sur la branche principale pour garantir l'absence d'erreurs TypeScript / Next.js.
