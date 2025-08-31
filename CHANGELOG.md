# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-01-XX

### Ajouté
- **Système de gestion de projets complet**
  - Création, lecture, modification, suppression de projets
  - Champs : nom, description, outils, liens résultats/fichiers, favoris, statut
  - Support des statuts : "Idée", "En cours", "Terminé"

- **Interface utilisateur riche et responsive**
  - Grille de cartes de projets avec design moderne
  - Affichage des badges d'outils utilisés
  - Système de favoris avec étoiles interactives
  - Indicateurs visuels de statut avec couleurs
  - Liens cliquables vers résultats et fichiers

- **Fonctionnalités de recherche et filtrage**
  - Recherche en temps réel sur nom, description et outils
  - Filtrage par outil avec boutons interactifs
  - Comptage dynamique de projets par outil
  - Combinaison recherche + filtrage
  - Reset global des filtres

- **Système de thèmes (clair/sombre)**
  - Bouton de changement de thème dans l'en-tête
  - Support complet du thème sombre pour tous les composants
  - Transitions fluides entre les thèmes
  - Gestion SSR pour éviter les flashs de thème

- **Animations et micro-interactions**
  - Effets de survol sur les cartes (scale subtil)
  - Transitions douces sur tous les éléments interactifs
  - Feedback visuel amélioré
  - États hover cohérents

- **API REST complète**
  - `GET /api/projects` - Récupérer tous les projets
  - `POST /api/projects` - Créer un nouveau projet
  - `PUT /api/projects/[id]` - Modifier un projet
  - `DELETE /api/projects/[id]` - Supprimer un projet
  - Validation des données et gestion d'erreurs
  - Logs détaillés pour le débogage

- **Base de données avec Prisma**
  - Modèle Project avec tous les champs nécessaires
  - SQLite pour stockage local
  - Migration automatique du schéma
  - Tri des projets (favoris en premier)

### Technologie
- **Frontend** : Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components** : shadcn/ui avec style New York
- **Backend** : API routes Next.js avec Prisma ORM
- **Base de données** : SQLite avec Prisma Client
- **Icons** : Lucide React
- **Theming** : next-themes
- **Gestion d'état** : React hooks (useState, useEffect)

### Fonctionnalités Techniques
- **Type Safety** : TypeScript strict sur tout le projet
- **Responsive Design** : Mobile-first avec breakpoints Tailwind
- **Accessibilité** : Composants sémantiques et attributs ARIA
- **Performance** : Code splitting et optimisation Next.js
- **Developer Experience** : ESLint, logs détaillés, hot reload

---

## Notes de développement

### Architecture du Projet
```
src/
├── app/
│   ├── api/
│   │   ├── projects/
│   │   │   ├── route.ts          # GET / POST
│   │   │   └── [id]/
│   │   │       └── route.ts      # PUT / DELETE
│   │   └── health/
│   │       └── route.ts          # Health check
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Page principale
│   └── globals.css               # Styles globaux
├── components/
│   └── ui/                       # Composants shadcn/ui
├── hooks/
│   ├── use-mobile.ts             # Hook détection mobile
│   └── use-toast.ts              # Hook notifications
└── lib/
    ├── db.ts                     # Client Prisma
    ├── utils.ts                  # Utilitaires
    └── socket.ts                 # WebSocket (Socket.io)
```

### Conventions de Codage
- Utiliser les composants shadcn/ui existants
- Privilégier le responsive design (mobile-first)
- TypeScript strict avec interfaces explicites
- Noms de fonctions et variables en français (UI) / anglais (technique)
- Classes Tailwind avec ordre logique
- Comments en français pour la logique métier

### Déploiement
```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev

# Build pour production
npm run build

# Linting du code
npm run lint

# Push du schéma Prisma
npm run db:push
```

### Variables d'Environnement
```env
DATABASE_URL="file:./dev.db"  # Base de données SQLite
```

---

## [À venir]

### Planifié
- **Édition avancée de projets**
  - Modal/formulaire complet pour l'édition
  - Validation en temps réel
  - Upload de fichiers
  
- **Système de tags/catégories**
  - Tags personnalisés pour les projets
  - Filtrage par catégories
  - Couleurs personnalisables

- **Export et import**
  - Export des projets en JSON/CSV
  - Import depuis d'autres plateformes
  - Synchronisation avec GitHub

- **Statistiques et dashboard**
  - Graphiques de progression
  - Temps passé par projet
  - Statistiques sur les outils utilisés

- **Recherche avancée**
  - Recherche plein texte
  - Filtres combinés complexes
  - Sauvegarde des recherches

### En Discussion
- **Authentification utilisateur**
  - Système de comptes utilisateurs
  - Partage de projets
  - Collaborations

- **Application mobile**
  - Version React Native
  - Synchronisation offline
  - Notifications push

- **Intégrations externes**
  - API GitHub
  - API GitLab
  - Autres plateformes de développement

---

## Guidelines de Contribution

1. **Forker** le repository
2. **Créer une branche** pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. **Committer** vos changements (`git commit -m 'Add amazing feature'`)
4. **Pusher** la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir une Pull Request**

### Standards de Code
- Respecter les conventions établies
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- Suivre le format de commit conventionnel

### Issues
- Utiliser le template d'issue pour rapporter des bugs
- Fournir un maximum de détails pour les demandes de fonctionnalités
- Vérifier qu'une issue similaire n'existe pas déjà

---

**Développé avec ❤️ en suivant la méthodologie de développement assisté par IA**