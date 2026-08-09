# MASTERPLAN — Artefacts Music

> **Document de référence officiel**
>
> Ce fichier définit la vision, les règles et les orientations du projet Artefacts Music.
> Toute décision de design, de développement ou de produit **doit respecter ce document**.

---

## 1. Vision du projet

**Artefacts Music** est une application professionnelle de gestion pour une société de production musicale.

Elle centralise l'ensemble de l'activité opérationnelle :

- Prestations et événements
- Répétitions
- Musiciens et formations
- Production
- Matériel
- Setlists
- Logistique et trajets

L'objectif est de fournir une interface **moderne, élégante et rapide**, inspirée de l'univers Apple, permettant à chaque membre de l'équipe d'accéder à l'information essentielle en quelques secondes — sur mobile comme sur desktop.

L'application doit évoluer naturellement vers une **application mobile native ou PWA**, sans refonte majeure de l'architecture.

---

## 2. Identité visuelle

### 2.1 Couleurs officielles

| Nom               | Hex       | Usage                                      |
|-------------------|-----------|--------------------------------------------|
| Bleu Méditerranée | `#1E6FB8` | Couleur principale, actions, navigation    |
| Bleu clair        | `#7CC6F5` | Accents, fonds secondaires, highlights     |
| Violet            | `#7A5AF8` | Répétitions, éléments créatifs             |
| Rose              | `#E96BA8` | Production, alertes douces                 |
| Blanc cassé       | `#F8FAFC` | Fond de page, interface lumineuse          |

**Principes visuels :**

- Interface très lumineuse
- Coins arrondis généreux
- Grandes cartes avec ombres légères
- Icônes modernes (Lucide)
- Police : **Inter**

### 2.2 Logo officiel

> **Statut : à ajouter**
>
> Le logo officiel Artefacts Music sera intégré ultérieurement.
> En attendant, un logo temporaire (note de musique sur dégradé) est utilisé dans l'application.
> Aucune variante de logo ne doit être créée sans validation.

---

## 3. Rôles utilisateurs

Chaque utilisateur possède un rôle unique qui détermine ses permissions et la vue qui lui est présentée.

| Rôle                  | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **Administrateur**    | Accès complet. Gestion des utilisateurs, des paramètres et de toutes les données. |
| **Production**        | Planification des prestations, répétitions, logistique, matériel et setlists.   |
| **Musicien**          | Consultation de son planning, des setlists et des informations de prestation.   |
| **Ingénieur du son**  | Gestion du matériel, des configurations techniques et de la logistique son.     |

**Règle :** l'interface s'adapte au rôle — un musicien ne voit que ce qui le concerne.

---

## 4. Formations

Une formation désigne la composition du groupe pour une prestation donnée.

| Formation | Musiciens |
|-----------|-----------|
| **Duo**   | 2         |
| **Trio**  | 3         |
| **Quartet** | 4       |
| **XXL**   | 5 et plus |

Chaque prestation est associée à une formation. La formation détermine le nombre de musiciens requis, les setlists adaptées et les besoins en matériel.

---

## 5. Types de prestations

| Type                  | Description                                              |
|-----------------------|----------------------------------------------------------|
| **Mariage**           | Cérémonie, cocktail, soirée dansante                     |
| **Domaine viticole**  | Événement dans un domaine, ambiance premium              |
| **Événement privé**   | Anniversaire, soirée corporate, réception privée         |
| **Événement public**  | Festival, concert, scène ouverte                         |
| **Répétition**        | Répétition générale ou section, en studio ou sur site    |

Chaque type de prestation peut avoir des exigences spécifiques (durée, matériel, setlist, logistique).

---

## 6. Principes de développement

Ces principes sont **non négociables**. Ils guident chaque choix technique et chaque écran.

### 6.1 Interface très simple

- Pas de surcharge visuelle
- Un écran = un objectif clair
- Textes courts, labels explicites
- Actions principales toujours visibles

### 6.2 Mobile d'abord

- Conception pensée pour le smartphone en premier
- Navigation par barre inférieure (bottom tab bar)
- Conteneur max-width adapté au format mobile
- Safe areas pour encoches et barres système
- Architecture prête pour une future app native ou PWA

### 6.3 Une information importante en moins de 5 secondes

- L'écran d'accueil répond immédiatement à : *« Qu'est-ce qui se passe ensuite ? »*
- Les données critiques (prochain événement, statut matériel, planning) sont visibles sans scroll
- Hiérarchie visuelle claire : titre → date → lieu → détails

### 6.4 Aucun écran inutile

- Chaque page doit justifier son existence par un besoin métier réel
- Pas de pages « vitrine » ou de contenu redondant
- Si une information est accessible en 1 clic depuis l'accueil, pas besoin d'une page dédiée

### 6.5 Respect de ce document

- Toute nouvelle fonctionnalité, page ou composant doit être évalué à l'aune de ce MASTERPLAN
- En cas de doute, privilégier la simplicité et la rapidité d'accès à l'information
- Les couleurs, rôles, formations et types de prestations listés ici font foi

---

## 7. Roadmap

### Phase 1 — Fondations *(en cours)*

- [x] Architecture Next.js + TypeScript + Tailwind
- [x] Page d'accueil avec tableau de bord
- [x] Pages : Accueil, Agenda, Prestations, Matériel, Profil
- [x] Navigation inférieure mobile-first
- [x] Données fictives et types TypeScript
- [x] Design system (couleurs, cartes, badges, logo temporaire)

### Phase 2 — Données et authentification

- [ ] Intégration base de données (Supabase, PostgreSQL ou équivalent)
- [ ] Authentification et gestion des rôles
- [ ] CRUD prestations, musiciens, matériel
- [ ] Filtrage par rôle (vue musicien vs production)

### Phase 3 — Gestion opérationnelle

- [ ] Répétitions — planification et suivi de présence
- [ ] Setlists — création, ordre des morceaux, partage avec musiciens
- [ ] Formations — assignation Duo / Trio / Quartet / XXL par prestation
- [ ] Types de prestations — Mariage, Domaine viticole, Événement privé/public

### Phase 4 — Logistique

- [ ] Trajets — planification des déplacements
- [ ] Matériel avancé — réservation, historique, maintenance
- [ ] Notifications — rappels d'événements, changements de planning

### Phase 5 — Mobile et polish

- [ ] Logo officiel intégré
- [ ] PWA — installation sur mobile, mode hors-ligne basique
- [ ] Optimisations performance (SSR, cache)
- [ ] Tests end-to-end

### Phase 6 — Évolutions

- [ ] Application mobile native (React Native ou Capacitor)
- [ ] Tableau de bord administrateur
- [ ] Export PDF (feuilles de route, setlists)
- [ ] Intégration calendrier externe (Google Calendar, iCal)

---

## 8. Structure technique actuelle

```
src/
├── app/                  # Pages (App Router)
├── components/
│   ├── ui/               # Composants réutilisables
│   ├── layout/           # Layout et navigation
│   └── home/             # Composants page d'accueil
├── lib/                  # Données, utilitaires, constantes
├── types/                # Types TypeScript
├── hooks/                # Hooks personnalisés (futur)
└── services/             # Couche API (futur)
```

---

*Dernière mise à jour : juillet 2026*
*Artefacts Music — Document de référence v1.0*
