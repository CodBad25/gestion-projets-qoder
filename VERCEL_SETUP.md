# Configuration Vercel avec PostgreSQL

## Problème résolu
L'application utilisait SQLite localement, mais Vercel ne peut pas persister SQLite dans un environnement serverless. La solution est d'utiliser PostgreSQL.

## Configuration requise sur Vercel

### 1. Créer une base de données PostgreSQL

Options recommandées :
- **Vercel Postgres** (intégré)
- **Supabase** (gratuit)
- **Railway** (gratuit)
- **Neon** (gratuit)

### 2. Configurer les variables d'environnement

Dans le dashboard Vercel, ajouter :

```
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
```

### 3. Exemple avec Vercel Postgres

1. Aller dans votre projet Vercel
2. Onglet "Storage" → "Create Database" → "Postgres"
3. Copier l'URL de connexion
4. L'ajouter comme variable d'environnement `DATABASE_URL`

### 4. Exemple avec Supabase (gratuit)

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Aller dans Settings → Database
4. Copier l'URL de connexion PostgreSQL
5. Format : `postgresql://postgres:[password]@[host]:5432/postgres`

### 5. Déploiement

Après configuration :

```bash
# Pousser les changements
git add .
git commit -m "Configure PostgreSQL for Vercel"
git push

# Vercel redéploiera automatiquement
```

### 6. Initialisation des données

La première fois, vous pouvez :

1. Importer vos projets via l'interface d'import
2. Ou exécuter le script d'initialisation (si configuré)

## Vérification

1. Vérifier que l'API `/api/projects` retourne les données
2. Tester l'import de projets
3. Vérifier que les données persistent entre les déploiements

## Notes importantes

- PostgreSQL est requis pour Vercel (environnement serverless)
- SQLite reste utilisable en développement local
- Les données seront persistantes avec PostgreSQL
- L'import/export fonctionne avec les deux bases de données