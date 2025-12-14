# Hardcore Economy Game - Version Web Interactive

## 🎮 Jouer au jeu

### Option 1: Serveur Web Simple (Recommandé)

```bash
cd web
node server.js
```

Puis ouvrez votre navigateur à: **http://localhost:8080**

### Option 2: Ouvrir directement le fichier HTML

Naviguez vers `web/index.html` et ouvrez-le dans votre navigateur.

**Note:** Certaines fonctionnalités peuvent nécessiter un serveur web local.

## 🎯 Comment Jouer

### Interface Principale

L'interface est divisée en plusieurs sections:

#### 1️⃣ Panneau des Ressources (en haut)
- **💰 Gold:** Votre monnaie principale pour payer les salaires et acheter des ressources
- **ℹ️ Information:** Révèle les vrais risques des missions
- **👑 Influence:** Pouvoir politique et stabilité
- **✝️ Faith:** Légitimité et contrôle de la rébellion

#### 2️⃣ État Politique
- **Stabilité:** Indicateur global de la santé de votre royaume
- **Risque de Rébellion:** Augmente avec les morts et la mauvaise gestion (Game Over à 100)

#### 3️⃣ Onglets Principaux

**🗡️ TROUPES**
- Voir toutes vos unités disponibles
- Chaque unité a:
  - Un type (Scout, Trader, Diplomat, Enforcer)
  - Des compétences (Combat, Diplomacy, Stealth, Trade)
  - Des traits avec bonus/malus
  - Un salaire attendu
  - Un statut (Ready, Wounded, Fatigued, On Mission)

**🎯 MISSIONS**
- **Missions Actives:** Voir les missions en cours (max 3 simultanées)
- **Missions Disponibles:** Liste de toutes les missions disponibles
- Cliquez sur "Préparer Mission" pour ouvrir le planificateur

**🏪 MARCHÉ**
- Acheter Information et Influence
- Les prix fluctuent selon l'offre/demande
- L'inflation augmente avec vos dépenses

### Lancer une Mission

1. Allez dans l'onglet **Missions**
2. Cliquez sur **"Préparer Mission"** pour une mission disponible
3. Dans le modal qui s'ouvre:
   - **Sélectionnez votre escouade** en cliquant sur les unités
   - **Choisissez la route:**
     - ⚡ **Rapide:** -10% puissance, +30% vitesse
     - ⚖️ **Équilibrée:** Normale
     - 🛡️ **Sûre:** +10% puissance, -30% vitesse
4. Consultez la **Prédiction** pour voir si vous allez réussir
5. Cliquez sur **"Lancer la Mission"**

### Prédictions de Mission

Le jeu est **100% déterministe**. La prédiction vous montre:
- **Puissance d'Escouade:** Calculée selon vos unités, traits, salaires
- **Risque de Mission:** Le danger réel
- **Score de Résultat:** Puissance - Risque

**Interprétation:**
- ✅ **Score ≥ 20:** Grand succès (récompenses × 1.5)
- ✅ **Score ≥ 0:** Succès
- ⚠️ **Score ≥ -10:** Succès partiel (pertes possibles)
- ❌ **Score < -10:** Échec catastrophique

### Formule de Puissance d'Escouade

```
SquadPower = Σ(SkillScore) × TraitModifiers × WageModifier × FatigueModifier × RouteModifier
```

**Facteurs Importants:**
- Payer le salaire complet = 100% performance
- Sous-payer = Pénalité de performance
- Fatigue réduit la puissance
- Blessures = -20% puissance
- Traits peuvent donner +20% ou -30%

### Gestion Politique

**⚠️ ATTENTION AUX MORTS!**

Chaque mort d'unité:
- Augmente le Risque de Rébellion
- Réduit l'Influence
- Réduit la Faith

**Game Over si:**
- Risque de Rébellion ≥ 100
- Faith + Influence = 0
- Assassination (Rébellion ≥ 80 + Faith < 20)
- Faillite (Gold ≤ 0)

### Conseils Stratégiques

1. **Investissez dans l'Information**
   - Elle révèle les vrais risques
   - Permet de planifier parfaitement

2. **Payez toujours les salaires complets**
   - Sous-payer = réduction massive de puissance
   - Répétition = rébellion

3. **Gérez la fatigue**
   - Les unités accumulent 10 de fatigue par mission
   - Fatigue réduit les performances
   - Laissez les unités se reposer

4. **Surveillez vos morts**
   - Chaque mort est permanente
   - Impact politique majeur
   - Peut déclencher une cascade vers Game Over

5. **Utilisez les synergies**
   - Certains traits se complètent
   - Veteran + Brave = bonus
   - Quick + Scout = bonus

6. **Missions parallèles**
   - Maximum 3 simultanées
   - Permet d'optimiser le temps
   - Mais attention aux ressources

## 🎨 Interface

### Responsive Design
- **Desktop:** Interface large avec toutes les informations
- **Mobile:** Interface optimisée pour touch
- **Tablette:** Interface adaptative

### Notifications
- En haut à droite
- Affichent les événements importants
- Couleurs:
  - 🟢 Vert: Succès
  - 🔴 Rouge: Échec/Erreur
  - 🔵 Bleu: Information

## ⚙️ Caractéristiques Techniques

### Pas de Backend Requis
- Tout s'exécute dans le navigateur
- Aucune connexion internet nécessaire
- Données stockées en mémoire (pas de sauvegarde automatique)

### Performance
- Mise à jour en temps réel (1 tick/seconde)
- Animations fluides
- Optimisé pour mobile

### Compatibilité
- Chrome/Edge (recommandé)
- Firefox
- Safari
- Opera

## 🐛 Debug

Pour voir les détails du jeu en console:
```javascript
// Dans la console du navigateur (F12)
window.gameUI.game  // Accès à l'état du jeu complet
```

## 📝 Notes de Développement

### Structure des Fichiers
```
web/
├── index.html      # Interface principale
├── styles.css      # Styles et responsive design
├── game.js         # Logique du jeu (adaptation browser du code TS)
├── server.js       # Serveur HTTP simple pour tester
└── WEB_README.md   # Ce fichier
```

### Différences avec la version CLI
- Interface graphique interactive
- Mise à jour en temps réel
- Notifications visuelles
- Pas de tutoriel interactif au démarrage (modal d'introduction seulement)

## 🚀 Prochaines Fonctionnalités (Idées)

- [ ] Sauvegarde dans localStorage
- [ ] Graphiques de progression
- [ ] Animations des missions
- [ ] Sons et musique
- [ ] Mode sombre/clair
- [ ] Statistiques détaillées
- [ ] Leaderboard local
- [ ] Export/Import de sauvegarde

## 🎯 Objectif de Victoire

Dominer toutes les routes commerciales en atteignant:
- 1000+ Influence
- 80+ Faith
- 5000+ Gold

Les joueurs experts peuvent y arriver en ~10 minutes!

---

**Bon jeu, Votre Majesté! 👑**
