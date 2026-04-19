# Changelog

Toutes les notes importantes sont ici. Le projet suit [SemVer](https://semver.org/lang/fr/).

## [0.1.0] — 2026-04-19

Première release publique — « Première lueur ». MVP V1 complet, pre-alpha.

### Ajouté
- V1 MVP complète : bootstrap Vue 3 + Vite + Tailwind + Pinia + router.
- Schéma de données versionné, stores `family` et `session`, persistance IndexedDB
  avec autosave débouncée et flush manuel.
- Import/export JSON avec chiffrement AES-GCM-256 optionnel via passphrase
  (PBKDF2-SHA256, 210 000 itérations).
- Questionnaire **6-8 ans** (`6-8-v1`) : 10 paires de thèmes, 15 actions, 6 questions
  de contexte, journée magique avec photo capture côté caméra.
- Questionnaire **9-11 ans** (`9-11-v1`) : 6 sections ratings 0-3 (34 items), 5 groupes
  d'actions, 8 questions de contexte, étape projections (semaine magique, lettre,
  3 personnes qui impressionnent).
- Synthèse de profil **sans aucun métier** : top 5 thèmes / top 5 actions / étiquette
  contexte + rendu des champs libres (journée magique, projections).
- Comparateur de deux passages côte-à-côte (thèmes stables/apparus/disparus, actions,
  contexte en tableau, journée magique).
- Exports : JSON clair ou chiffré, PDF souvenir (jsPDF), .ics RFC 5545 avec rappel
  annuel et alarme 1 jour avant.
- PWA installable (vite-plugin-pwa, Workbox generateSW), offline complet, manifest
  FR, icônes 192/512/maskable, composant d'invitation à l'installation.
- Prerender SSG (vite-ssg) des pages publiques : Accueil, À propos, FAQ, Journal +
  3 articles de fond.
- JSON-LD `SoftwareApplication` / `Person` / `FAQPage` / `Article` sur les pages
  publiques. Sitemap généré au build.
- Docker multistage (node builder → nginx:alpine), docker-compose prêt Traefik +
  Let's Encrypt + HSTS. CI GitHub Actions (lint, typecheck, unit, build, bundle,
  E2E) et workflow de release d'image vers GHCR.
- Accessibilité : police Atkinson Hyperlegible, tokens de couleur AA,
  `prefers-reduced-motion`, focus visible, bouton « lire à voix haute » (Web Speech).

### Non inclus (V2+)
- Mode multi-famille / plusieurs carnets en parallèle.
- Traduction (anglais).
- Graphiques d'évolution temporelle.
- Mode éducatif pour classe.
