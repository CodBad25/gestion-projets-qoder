# 📋 Gestionnaire de Projets Personnels

Une application web moderne pour centraliser et organiser tous vos projets informatiques. Développée avec Next.js, TypeScript et Tailwind CSS, cette application vous permet de gérer efficacement vos projets avec une interface intuitive et des fonctionnalités puissantes.

## ✨ Fonctionnalités

### 🎯 Gestion de Projets Complète
- **CRUD complet** : Créer, modifier, supprimer et visualiser vos projets
- **Informations détaillées** : Nom, description, outils utilisés, liens vers résultats et fichiers
- **Statuts d'avancement** : Suivez vos projets avec les statuts "Idée", "En cours", "Terminé"
- **Favoris** : Marquez vos projets importants avec un système d'étoiles
- **Tri intelligent** : Les projets favoris apparaissent toujours en premier

### 🔍 Recherche et Filtrage Avancés
- **Recherche en temps réel** : Trouvez instantanément des projets par nom, description ou outils
- **Filtrage par outil** : Filtrez vos projets selon les technologies utilisées
- **Combinaison de filtres** : Utilisez la recherche et le filtrage simultanément
- **Reset global** : Effacez tous les filtres en un clic

### 🎨 Interface Moderne et Responsive
- **Design élégant** : Interface inspirée des meilleures pratiques modernes
- **Thème sombre/clair** : Basculez facilement entre les thèmes pour votre confort
- **Animations subtiles** : Micro-interactions et transitions fluides
- **Responsive design** : Parfaitement adapté pour Mac, PC et mobiles
- **Accessibilité** : Conçu pour être utilisable par tous

### 🛠️ Technologie de Pointe
- **Type Safety** : TypeScript pour un code robuste et maintenable
- **Performance** : Optimisé pour des temps de chargement rapides
- **Offline-friendly** : Fallbacks UX pour fonctionnement sans connexion
- **API REST** : Backend complet avec validation et gestion d'erreurs

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd gestionnaire-projets

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

### Scripts Disponibles

```bash
npm run dev          # Lance le serveur de développement
npm run build        # Build pour production
npm run start        # Lance le serveur de production
npm run lint         # Vérifie la qualité du code
npm run db:push      # Pousse le schéma Prisma vers la base de données
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── api/
│   │   ├── projects/
│   │   │   ├── route.ts          # GET / POST projets
│   │   │   └── [id]/
│   │   │       └── route.ts      # PUT / DELETE projet
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

## 🗄️ Base de Données

### Schéma
L'utilisation une base de données SQLite avec Prisma ORM. Le schéma principal :

```prisma
model Project {
  id          String   @id @default(cuid())
  name        String   // Nom du projet
  description String?  // Description optionnelle
  tools       String   // Outils utilisés (séparés par virgules)
  resultLink  String?  // Lien vers les résultats
  filesLink   String?  // Lien vers les fichiers
  isFavorite  Boolean  @default(false)  // Statut de favori
  status      String   @default("idea") // "idea", "in_progress", "completed"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Migration
Le schéma est automatiquement synchronisé avec la base de données :

```bash
npm run db:push
```

## 🔌 API Endpoints

### Projets
- `GET /api/projects` - Récupérer tous les projets (triés par favoris)
- `POST /api/projects` - Créer un nouveau projet
- `PUT /api/projects/[id]` - Modifier un projet existant
- `DELETE /api/projects/[id]` - Supprimer un projet

### Validation
Tous les endpoints incluent :
- Validation des données d'entrée
- Gestion des erreurs appropriée
- Réponses JSON standardisées
- Logs détaillés pour le débogage

## 🎨 Interface Utilisateur

### Composants Principaux
- **ProjectCard** : Carte individuelle pour chaque projet
- **SearchBar** : Champ de recherche en temps réel
- **ToolFilter** : Boutons de filtrage par outil
- **ThemeToggle** : Bouton de changement de thème

### Interactions
- **Clic sur l'étoile** : Ajoute/supprime des favoris
- **Clic sur le statut** : Ouvre un menu pour changer le statut
- **Hover sur les cartes** : Effet de scale subtil
- **Recherche instantanée** : Filtre en temps réel

### Thème
- **Thème clair** : Design par défaut pour usage diurne
- **Thème sombre** : Pour un confort visuel en environnement sombre
- **Transition fluide** : Changement instantané entre les thèmes

## 🛠️ Stack Technique

### Frontend
- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Type safety et meilleure expérience développeur
- **Tailwind CSS** : Utility-first CSS framework
- **shadcn/ui** : Composants UI de haute qualité
- **Lucide React** : Bibliothèque d'icônes
- **next-themes** : Gestion des thèmes sombre/clair

### Backend
- **API Routes** : Endpoints REST intégrés à Next.js
- **Prisma** : ORM moderne pour Node.js
- **SQLite** : Base de données légère et portable

### Développement
- **ESLint** : Analyse statique du code
- **Hot Reload** : Développement rapide avec rafraîchissement automatique
- **Git** : Contrôle de version

## 🌐 Déploiement

### Build pour Production

```bash
# Build de l'application
npm run build

# Lancement en production
npm start
```

### Configuration
Variables d'environnement requises :

```env
DATABASE_URL="file:./dev.db"  # Chemin vers la base de données SQLite
```

## 📝 Conventions de Codage

### TypeScript
- Utiliser des interfaces explicites pour les props
- Typage strict pour toutes les variables et fonctions
- Éviter `any` autant que possible

### React
- Composants fonctionnels avec hooks
- Noms de composants en PascalCase
- Props destructurées pour une meilleure lisibilité

### Styles
- Classes Tailwind avec ordre logique
- Responsive design (mobile-first)
- Privilégier les classes utilitaires

### Nommage
- Fonctions et variables techniques en anglais
- Textes et labels en français (interface utilisateur)
- Noms de fichiers en kebab-case

## 🔧 Dépannage

### Problèmes Communs

**Base de données non initialisée**
```bash
npm run db:push
```

**Erreurs de compilation**
```bash
npm run lint
# Corriger les erreurs signalées
```

**Problèmes de dépendances**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Performance
- L'application est optimisée pour le chargement rapide
- Les images sont optimisées automatiquement
- Le code est splité pour un chargement efficace

## 🤝 Contribution

### Guidelines
1. Forker le repository
2. Créer une branche pour votre fonctionnalité
3. Committer vos changements avec des messages clairs
4. Ouvrir une Pull Request

### Standards de Code
- Respecter les conventions établies
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- Code linté avant de soumettre

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

Développé avec ❤️ en suivant la méthodologie de développement assisté par IA avec [Z.ai](https://chat.z.ai).

---

**Pour commencer à utiliser l'application :**
1. Installez les dépendances avec `npm install`
2. Lancez le serveur avec `npm run dev`
3. Ouvrez http://localhost:3000 dans votre navigateur
4. Commencez à ajouter vos projets !

**Besoin d'aide ?** Consultez le [CHANGELOG.md](CHANGELOG.md) pour voir l'historique des modifications ou ouvrez une issue pour signaler un problème.