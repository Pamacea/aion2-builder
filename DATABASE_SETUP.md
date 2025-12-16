# Configuration de la Base de Données PostgreSQL sur Vercel

## Option 1 : Vercel Postgres (Recommandé)

### Étapes :

1. **Aller sur votre projet Vercel**
   - Ouvrez [vercel.com](https://vercel.com)
   - Sélectionnez votre projet `aion2builder`

2. **Ajouter Vercel Postgres**
   - Cliquez sur l'onglet **"Storage"** dans le menu de votre projet
   - Cliquez sur **"Create Database"**
   - Sélectionnez **"Postgres"**
   - Choisissez un nom pour votre base de données (ex: `aion2builder-db`)
   - Sélectionnez la région la plus proche (ex: `Frankfurt (eu-central-1)`)
   - Cliquez sur **"Create"**

3. **Configurer la variable d'environnement**
   - Vercel Postgres ajoute automatiquement une variable `POSTGRES_URL` ou `DATABASE_URL`
   - Allez dans **Settings** → **Environment Variables**
   - Vérifiez que `DATABASE_URL` est bien présente
   - Si ce n'est pas le cas, Vercel Postgres fournit généralement `POSTGRES_URL` - vous pouvez soit :
     - Copier la valeur et créer une variable `DATABASE_URL` avec la même valeur
     - OU modifier votre code pour utiliser `POSTGRES_URL`

4. **Exécuter les migrations**
   - Dans le terminal local (avec `DATABASE_URL` configurée), exécutez :
     ```bash
     pnpm prisma migrate deploy
     ```
   - Ou via Vercel CLI :
     ```bash
     vercel env pull
     pnpm prisma migrate deploy
     ```

---

## Option 2 : Neon (PostgreSQL Serverless - Gratuit jusqu'à 512MB)

### Étapes :

1. **Créer un compte Neon**
   - Allez sur [neon.tech](https://neon.tech)
   - Créez un compte gratuit
   - Créez un nouveau projet

2. **Récupérer la connection string**
   - Dans le dashboard Neon, copiez la **Connection String**
   - Elle ressemble à : `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

3. **Ajouter la variable dans Vercel**
   - Dans votre projet Vercel : **Settings** → **Environment Variables**
   - Ajoutez une nouvelle variable :
     - **Name** : `DATABASE_URL`
     - **Value** : La connection string copiée depuis Neon
     - Cochez les environnements (Production, Preview, Development)
   - Cliquez sur **"Save"**

4. **Exécuter les migrations**
   - Localement avec la variable d'environnement :
     ```bash
     vercel env pull  # Pour récupérer les variables depuis Vercel
     pnpm prisma migrate deploy
     ```

---

## Option 3 : Supabase (Alternative populaire)

### Étapes :

1. **Créer un projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un compte et un nouveau projet

2. **Récupérer la connection string**
   - Allez dans **Settings** → **Database**
   - Copiez la **Connection String** (URI format)
   - Ajoutez `?pgbouncer=true` à la fin si vous utilisez Supabase

3. **Configurer dans Vercel**
   - Même processus que pour Neon (étape 3 ci-dessus)

---

## Après Configuration

### 1. Tester la connexion localement

Créez un fichier `.env.local` (ne pas committer) :
```env
DATABASE_URL="votre_connection_string_ici"
```

Puis testez :
```bash
pnpm prisma db pull  # Vérifie la connexion
```

### 2. Exécuter les migrations

```bash
# En production (via Vercel ou CLI)
pnpm prisma migrate deploy

# En développement local
pnpm prisma migrate dev
```

### 3. Redéployer sur Vercel

Après avoir ajouté la variable `DATABASE_URL` dans Vercel, redéployez votre projet :
- Vercel redéploiera automatiquement, OU
- Cliquez sur **"Redeploy"** dans le dashboard

---

## Notes importantes

- ✅ **Vercel Postgres** : Intégré directement, gratuit jusqu'à 256MB
- ✅ **Neon** : Très populaire, gratuit jusqu'à 512MB, excellent pour le serverless
- ✅ **Supabase** : Inclut beaucoup de fonctionnalités (Auth, Storage, etc.), gratuit généreusement

Pour votre projet, je recommande **Neon** ou **Vercel Postgres** pour leur simplicité et leur compatibilité avec Next.js serverless.
