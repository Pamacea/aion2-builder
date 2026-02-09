[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/Pamacea/aion2-builder)](https://github.com/Pamacea/aion2-builder/releases/latest)
[![CI](https://github.com/Pamacea/aion2-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/Pamacea/aion2-builder/actions)


![Logo](/bahion.webp)

# BAHION - AION 2 BUILDER

**BAHION** est un outil de théorie de build (theorycrafting) pour **Aion 2**, permettant aux joueurs de créer, partager et optimiser leurs configurations de compétences. L'application offre une interface intuitive pour gérer les compétences actives, passives et stigmas, avec un système de partage communautaire intégré.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Fonctionnalités détaillées](#-fonctionnalités-détaillées)
- [Auteur](#-auteur)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 🎮 Gestion des Builds
- **Création de builds personnalisés** : Créez vos propres configurations de compétences pour chaque classe
- **Builds de référence (Starter Builds)** : Builds de base non modifiables pour chaque classe
- **Sauvegarde automatique** : Vos modifications sont sauvegardées automatiquement
- **Aperçu en temps réel** : Visualisez les statistiques et caractéristiques de votre build instantanément
- **Gestion des points** : Système de Skill Points (SP) et Stigma Points (STP) avec points de base et bonus

### 🛠️ Éditeur de Build
- **Compétences actives (Abilities)** : Gérez jusqu'à 12 compétences par classe, niveau 1-10
- **Compétences passives (Passives)** : Configurez jusqu'à 10 passifs par classe, niveau 1-10
- **Stigmas** : Équipez jusqu'à 4 stigmas actifs, niveau 1-20
- **Choix de spécialités** : Personnalisez vos compétences avec des spécialités débloquables
- **Chain Skills** : Configurez les enchaînements de compétences (max 2 par compétence)
- **Barre de raccourcis** : Organisez vos compétences dans une barre de raccourcis personnalisable
- **Drag & Drop** : Interface intuitive avec glisser-déposer pour organiser vos compétences

### 👥 Communauté
- **Partage de builds** : Partagez vos builds avec la communauté
- **Système de likes** : Aimez les builds qui vous intéressent
- **Catalogue de builds** : Explorez les builds créés par d'autres joueurs
- **Filtres et tri** : Filtrez par classe, nom, et triez par popularité, date
- **Fork de builds** : Créez votre propre version d'un build existant

### 🔐 Authentification
- **Connexion Discord** : Authentification via Discord OAuth2
- **Profil utilisateur** : Gérez vos builds créés et vos builds likés
- **Protection des builds** : Seul le propriétaire peut modifier son build

### 📱 Interface
- **Design moderne** : Interface élégante et intuitive
- **Responsive** : Optimisé pour mobile, tablette et desktop
- **Thème sombre** : Interface adaptée pour un confort visuel optimal
- **Accessibilité** : Navigation claire et intuitive

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 16** : Framework React avec App Router
- **React 19** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Tailwind CSS 4** : Framework CSS utilitaire
- **Radix UI** : Composants UI accessibles (Select, Alert Dialog, etc.)
- **React DnD** : Glisser-déposer pour les compétences
- **Zustand** : Gestion d'état légère
- **TanStack Query** : Gestion des requêtes serveur
- **Sonner** : Notifications toast
- **Lucide React** : Icônes

### Backend
- **Next.js API Routes** : Routes API intégrées
- **NextAuth.js v5** : Authentification avec Prisma Adapter
- **Prisma 7** : ORM pour PostgreSQL
- **PostgreSQL** : Base de données relationnelle
- **Zod** : Validation de schémas TypeScript

### Outils de développement
- **ESLint** : Linter pour la qualité du code
- **TypeScript** : Compilateur et vérificateur de types
- **Prisma Zod Generator** : Génération de schémas Zod depuis Prisma

## 📦 Prérequis

- **Node.js** 18+ (recommandé : 20+)
- **PostgreSQL** 14+ (ou service cloud comme Supabase, Neon, etc.)
- **npm** ou **yarn** ou **pnpm** ou **bun**
- **Compte Discord** (pour l'authentification OAuth)

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/oalacea/aion2builder.git
cd aion2builder
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

3. **Configurer la base de données**
```bash
# Créer un fichier .env.local à la racine du projet
cp .env.example .env.local
```

4. **Configurer les variables d'environnement** (voir section Configuration)

5. **Initialiser la base de données**
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# (Optionnel) Remplir la base de données avec les données initiales
npx prisma db seed
```

6. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/aion2builder?schema=public"

# NextAuth.js
AUTH_SECRET="votre-secret-nextauth" # Générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_URL="http://localhost:3000"

# Discord OAuth (obtenir sur https://discord.com/developers/applications)
DISCORD_CLIENT_ID="votre-client-id-discord"
DISCORD_CLIENT_SECRET="votre-client-secret-discord"
```

### Configuration Discord OAuth

1. Aller sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créer une nouvelle application
3. Dans l'onglet "OAuth2", ajouter l'URL de redirection :
   - `http://localhost:3000/api/auth/callback/discord` (développement)
   - `https://votre-domaine.com/api/auth/callback/discord` (production)
4. Copier le Client ID et le Client Secret dans `.env.local`

## 📖 Utilisation

### Créer un build

1. Naviguez vers la page des classes (`/classes`)
2. Sélectionnez une classe
3. Cliquez sur "Create Your Build" (nécessite une connexion Discord)
4. Configurez vos compétences dans l'éditeur :
   - Ajustez les niveaux des compétences actives et passives
   - Équipez jusqu'à 4 stigmas
   - Activez les spécialités aux niveaux requis
   - Configurez les chain skills
   - Organisez votre barre de raccourcis

### Explorer les builds

1. Naviguez vers le catalogue (`/morebuild`)
2. Utilisez les filtres pour trouver des builds spécifiques :
   - Filtre par classe
   - Recherche par nom
   - Tri par popularité, date de création
3. Cliquez sur "Show Build" pour voir les détails
4. Cliquez sur "Fork Build" pour créer votre propre version

### Gérer votre profil

1. Connectez-vous avec Discord
2. Cliquez sur votre nom d'utilisateur dans le header
3. Accédez à votre profil (`/myprofile`) :
   - **Informations** : Vos informations de compte
   - **My Builds** : Tous vos builds créés
   - **Liked Builds** : Les builds que vous avez aimés

## 📁 Structure du projet

```
aion2builder/
├── prisma/
│   ├── schema.prisma          # Schéma de base de données
│   ├── seed.ts                # Script de seeding
│   └── migrations/            # Migrations Prisma
├── public/
│   ├── icons/                 # Icônes de l'application
│   └── bahion.webp            # Logo
├── src/
│   ├── app/                   # Pages Next.js (App Router)
│   │   ├── api/               # Routes API
│   │   ├── build/             # Pages de build
│   │   ├── classes/           # Pages des classes
│   │   ├── morebuild/         # Catalogue de builds
│   │   └── myprofile/         # Profil utilisateur
│   ├── actions/               # Server Actions
│   ├── components/            # Composants React
│   ├── contexts/              # Contextes React (Auth)
│   ├── constants/             # Constantes
│   ├── data/                  # Données statiques (classes)
│   ├── generated/             # Code généré (Prisma)
│   ├── hooks/                 # Hooks React personnalisés
│   ├── lib/                   # Utilitaires
│   ├── store/                 # Store Zustand
│   ├── types/                 # Types TypeScript
│   └── utils/                 # Fonctions utilitaires
├── .env.local                 # Variables d'environnement (non versionné)
├── next.config.ts             # Configuration Next.js
├── package.json               # Dépendances npm
├── tailwind.config.ts         # Configuration Tailwind
└── tsconfig.json              # Configuration TypeScript
```

## 🎯 Fonctionnalités détaillées

### Système de Build

- **Points de compétence (SP)** : 231 points de base + bonus (Wisdom Stone, etc.)
- **Points de stigma (STP)** : 40 points de base + bonus farmables
- **Limite de stigmas** : Maximum 4 stigmas actifs (niveau >= 1) par build
- **Auto-attack** : La première compétence ne peut pas être désactivée (minimum niveau 1)

### Système de compétences

- **Abilities** : 12 compétences par classe, niveau 1-10, avec spécialités et chain skills
- **Passives** : 10 passifs par classe, niveau 1-10
- **Stigmas** : Stigmas partagés ou spécifiques à une classe, niveau 1-20
- **Chain Skills** : Enchaînements de compétences avec conditions spécifiques
- **Specialty Choices** : Choix de spécialités débloquables aux niveaux 8, 12, 16

### Statistiques des compétences

Chaque compétence peut avoir :
- Dommages (min, max, boost, tolérance)
- Soins (min, max, boost, soin entrant)
- Points de vie/mana (min, max)
- Résistances (critique, effets de statut, type d'impact)
- Attaque/Défense
- Blocage, DPS, dommage d'étourdissement
- Portée, zone d'effet, temps de lancement, recharge
- Conditions d'activation et d'effet

Les statistiques peuvent évoluer par niveau avec :
- Un modificateur fixe par niveau
- Un tableau de modificateurs personnalisés par niveau

## 👤 Auteur

- **Yanis Dessaint** ([@oalacea](https://github.com/Pamacea))

## 📄 Licence

Ce projet est sous licence [MIT](https://choosealicense.com/licenses/mit/).

---

**Note** : Ce projet est en développement actif. Les fonctionnalités peuvent évoluer et certaines peuvent être en cours d'implémentation.
