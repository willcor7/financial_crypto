# 🚀 CryptoTracker - Site d'Analyse de Cryptomonnaies

Un site moderne et réactif pour suivre les prix et les tendances des cryptomonnaies en temps réel.

## ✨ Fonctionnalités

- 📊 **Marché en temps réel** - Suivez les prix de plus de 100 cryptomonnaies
- 📈 **Graphiques interactifs** - Visualisez l'évolution des prix sur différentes périodes
- ⭐ **Watchlist personnalisée** - Gardez un œil sur vos cryptos favorites
- 🌓 **Mode sombre/clair** - Interface adaptative pour le confort visuel
- 💱 **Multi-devises** - Support USD, EUR et BTC
- 📱 **Responsive** - Optimisé pour mobile, tablette et desktop
- 🔍 **Détails complets** - Informations détaillées pour chaque cryptomonnaie

## 🛠️ Technologies Utilisées

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **Gestion d'état** : React Context API
- **Data Fetching** : TanStack Query (React Query)
- **Graphiques** : Recharts
- **API** : CoinGecko API
- **Icons** : Lucide React

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone <votre-repo>
   cd financial_crypto
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```

   **Note** : L'API CoinGecko fonctionne sans clé API pour un usage de base. Pour des limites de taux plus élevées, vous pouvez obtenir une clé gratuite sur [CoinGecko](https://www.coingecko.com/en/api/pricing).

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🚀 Scripts Disponibles

```bash
npm run dev      # Lancer en mode développement
npm run build    # Build pour la production
npm run start    # Lancer en mode production
npm run lint     # Vérifier le code avec ESLint
```

## 📁 Structure du Projet

```
financial_crypto/
├── src/
│   ├── app/                      # Pages Next.js (App Router)
│   │   ├── crypto/[id]/         # Page détail crypto
│   │   ├── watchlist/           # Page watchlist
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Page d'accueil
│   │   └── globals.css          # Styles globaux
│   ├── components/
│   │   ├── charts/              # Composants graphiques
│   │   ├── crypto/              # Composants crypto
│   │   ├── features/            # Composants fonctionnels
│   │   ├── layout/              # Header, Footer
│   │   ├── providers/           # Providers React
│   │   └── ui/                  # Composants UI réutilisables
│   ├── context/                 # Contexts React
│   ├── hooks/                   # Hooks personnalisés
│   ├── lib/
│   │   ├── api/                 # Services API
│   │   └── utils/               # Fonctions utilitaires
│   └── types/                   # Types TypeScript
├── public/                      # Assets statiques
├── .env.example                 # Exemple de variables d'environnement
└── package.json
```

## 🎯 Fonctionnalités Détaillées

### Page d'accueil
- Vue d'ensemble du marché global
- Tableau des top 100 cryptomonnaies
- Tri par prix, market cap, variation 24h
- Ajout rapide à la watchlist

### Page détail crypto
- Graphique de prix interactif (1J, 7J, 1M, 3M, 1A, MAX)
- Statistiques détaillées (ATH, ATL, Supply, Volume)
- Liens vers le site officiel et explorateur blockchain
- Description de la cryptomonnaie

### Watchlist
- Liste personnalisée de cryptos favorites
- Synchronisation avec localStorage
- Vue rapide des variations

## 🌐 APIs Utilisées

### CoinGecko API
- **Endpoint** : `https://api.coingecko.com/api/v3`
- **Rate limit** : 10-50 appels/minute (gratuit)
- **Documentation** : [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)

## 🎨 Personnalisation

### Changer les couleurs
Les couleurs sont gérées par Tailwind CSS. Modifiez les classes dans les composants ou créez des variables CSS personnalisées dans `globals.css`.

### Ajouter des cryptos
Le nombre de cryptos affichées peut être modifié dans `src/app/page.tsx` en changeant le paramètre `perPage`.

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Build manuel
```bash
npm run build
npm run start
```

## 📝 TODO

- [ ] Ajouter un convertisseur de devises
- [ ] Implémenter la recherche de cryptos
- [ ] Ajouter des indicateurs techniques (RSI, MACD)
- [ ] Mode comparaison de cryptos
- [ ] Export de données en CSV
- [ ] Notifications pour alertes de prix
- [ ] Portfolio tracker

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT License - Vous êtes libre d'utiliser ce projet comme vous le souhaitez.

## 🙏 Remerciements

- Données fournies par [CoinGecko](https://www.coingecko.com)
- Icons par [Lucide](https://lucide.dev)
- Framework [Next.js](https://nextjs.org)

---

**Made with ❤️ by Claude Code**
