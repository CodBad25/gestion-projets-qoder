# Guide de Test - Import/Export Vercel

## Problème Résolu

Le problème "import réussi mais 0 projets affichés" était causé par :
- **SQLite** ne fonctionne pas dans l'environnement serverless de Vercel
- Les données étaient perdues entre les déploiements

## Solution Implémentée

### Configuration Hybride :
- **Local** : SQLite (`file:./prisma/dev.db`)
- **Production Vercel** : PostgreSQL (via votre URL Supabase)

### Changements Effectués :
1. ✅ Schéma Prisma séparé pour production (`schema.production.prisma`)
2. ✅ Script de build Vercel modifié pour utiliser PostgreSQL
3. ✅ Configuration locale maintenue avec SQLite
4. ✅ Script de diagnostic créé (`test-db-connection.mjs`)

## Test à Effectuer

### 1. Vérifier le Déploiement Vercel
- Aller sur votre dashboard Vercel
- Vérifier que le dernier déploiement est réussi
- URL de production : `https://gestion-projets-qoder.vercel.app`

### 2. Configurer la Variable d'Environnement
**IMPORTANT** : Vous devez configurer `DATABASE_URL` dans Vercel :

1. Aller dans Vercel Dashboard → Votre Projet → Settings → Environment Variables
2. Ajouter :
   - **Name** : `DATABASE_URL`
   - **Value** : Votre URL Supabase PostgreSQL
   - **Environments** : Production, Preview, Development

### 3. Tester l'Import

1. **Exporter depuis Local** :
   - Aller sur `http://localhost:3000`
   - Cliquer sur "Exporter JSON"
   - Sauvegarder le fichier

2. **Importer sur Vercel** :
   - Aller sur `https://gestion-projets-qoder.vercel.app`
   - Cliquer sur "Importer JSON"
   - Sélectionner le fichier exporté
   - **Résultat attendu** : Les projets doivent apparaître et persister

### 4. Vérification
- Rafraîchir la page → Les projets doivent rester
- Attendre quelques minutes et revenir → Les projets doivent toujours être là

## En Cas de Problème

### Diagnostic :
```bash
# Tester la connexion locale
node scripts/test-db-connection.mjs
```

### Logs Vercel :
1. Aller dans Vercel Dashboard → Functions
2. Cliquer sur une fonction API
3. Voir les logs d'exécution

### Variables d'Environnement :
- Vérifier que `DATABASE_URL` est bien configurée dans Vercel
- Format attendu : `postgresql://user:password@host:port/database`

## État Actuel

- ✅ **Local** : Fonctionne avec SQLite + 3 projets de démo
- ✅ **Code** : Poussé sur GitHub
- ⏳ **Vercel** : En attente de configuration `DATABASE_URL`
- ⏳ **Test** : À effectuer après configuration

**Prochaine étape** : Configurer `DATABASE_URL` dans Vercel puis tester l'import.