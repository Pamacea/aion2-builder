# Configuration NextAuth sur Vercel

## Variables d'environnement requises

Assurez-vous que ces variables sont configurées sur Vercel :

### 1. Variables d'authentification (OBLIGATOIRES)

Sur **Vercel** → **Settings** → **Environment Variables**, ajoutez :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `AUTH_SECRET` | `vI6/Rw0eg/zNxxp5fmlOE9ksqnckc4zQREdmz9IIo5k=` | Production, Preview, Development |
| `AUTH_URL` | `https://aion2builder.vercel.app` | Production |
| `AUTH_URL` | `https://aion2builder-[votre-branch].vercel.app` | Preview |
| `AUTH_URL` | `http://localhost:3000` | Development (optionnel, pour tests locaux) |

### 2. Variables Discord (OBLIGATOIRES)

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `DISCORD_CLIENT_ID` | `1450171324562542602` | Production, Preview, Development |
| `DISCORD_CLIENT_SECRET` | `E58I7JxeLT7Nh9nCXJuMpa2nHxrzK9UL` | Production, Preview, Development |

### 3. Variables de base de données

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `DATABASE_URL` | Votre URL PostgreSQL (postgresql://...) | Production, Preview, Development |

## Comment vérifier sur Vercel

1. Allez sur https://vercel.com
2. Sélectionnez votre projet `aion2builder`
3. Allez dans **Settings** → **Environment Variables**
4. Vérifiez que toutes les variables ci-dessus sont présentes
5. **IMPORTANT** : Vérifiez que `AUTH_URL` pour Production est exactement `https://aion2builder.vercel.app` (sans `/` à la fin)

## Problème courant : Erreur "Configuration"

Si vous voyez l'erreur `/api/auth/error?error=Configuration`, c'est généralement dû à :

1. **`AUTH_SECRET` manquant** → Ajoutez-le sur Vercel
2. **`AUTH_URL` incorrecte** → Doit correspondre exactement à l'URL de votre déploiement
3. **Variables Discord incorrectes** → Vérifiez `DISCORD_CLIENT_ID` et `DISCORD_CLIENT_SECRET`

## Vérification après configuration

Après avoir ajouté/modifié les variables :

1. **Redéployez** votre application sur Vercel (Settings → Deployments → Rebuild)
2. Vérifiez les logs de build pour voir si les variables sont chargées
3. Testez la connexion Discord

## Note importante

- `AUTH_URL` doit correspondre **exactement** à l'URL de votre application
- Ne mettez **pas** de `/` à la fin de `AUTH_URL`
- Les variables sont sensibles à la casse (majuscules/minuscules)
