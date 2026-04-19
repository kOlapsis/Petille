<div align="center">

# ✨ Pétille

**Ce qui fait briller ton enfant.**

Un carnet d'appétences pour les enfants de 6 à 11 ans.
Sans compte, sans tracking, sans aucun métier suggéré.

[![Licence: AGPL v3](https://img.shields.io/badge/licence-AGPL_v3-blue.svg)](LICENSE)
[![Status: Pre-alpha](https://img.shields.io/badge/status-pre--alpha-orange.svg)](#roadmap)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8.svg)]()
[![No tracking](https://img.shields.io/badge/tracking-zéro-success.svg)]()

[Démo](#) · [Documentation](#) · [Signaler un bug](../../issues) · [Proposer une idée](../../discussions)

</div>

---

## En une phrase

Pétille aide les enfants de 6 à 11 ans à découvrir ce qu'ils aiment vraiment, à travers un questionnaire annuel — et garde la trace de leurs réponses pour observer, ensemble, comment leurs envies évoluent au fil des années.

---

## Sommaire

- [Pourquoi Pétille](#pourquoi-pétille)
- [Ce que Pétille fait (et ne fait pas)](#ce-que-pétille-fait-et-ne-fait-pas)
- [Principes fondateurs](#principes-fondateurs)
- [Utilisation](#utilisation)
- [Self-hosting](#self-hosting)
- [Développement local](#développement-local)
- [Architecture](#architecture)
- [Roadmap](#roadmap)
- [Alternatives et complémentarité](#alternatives-et-complémentarité)
- [Contribuer](#contribuer)
- [Licence](#licence)
- [Auteur](#auteur)

---

## Pourquoi Pétille

Entre 6 et 10 ans, les enfants cristallisent leur univers de "métiers possibles" sur ce qu'ils voient autour d'eux : vétérinaire, policier, maîtresse, pompier, docteur. C'est un stade normal du développement — pas un problème à résoudre.

Mais c'est aussi l'âge où les stéréotypes se fixent. Une étude classique ("draw a scientist") montre qu'à 5 ans, les filles dessinent autant de scientifiques femmes que d'hommes. À 10 ans, la proportion s'est massivement inversée.

Le rôle d'un outil bienveillant n'est pas de **casser** ces représentations — ce serait infantilisant et contre-productif. C'est de **garder la fenêtre ouverte** : proposer un espace régulier où l'enfant note ce qui le fait vibrer, sans qu'on lui souffle la conclusion.

Les outils d'orientation existants en France sont solides, mais démarrent tous au collège :

- **[Avenir(s)](https://avenirs.onisep.fr/)** (Onisep, officiel, gratuit) — démarre en 5e (12 ans)
- **[Wilbi](https://wilbi.me/)** — vidéos métiers, collège et lycée
- **[Hello Charly](https://hello-charly.com/)** — chatbot d'orientation, 15-25 ans
- **[JobIRL](https://www.jobirl.com/)** — réseau social d'orientation, 14-25 ans

Entre 6 et 11 ans, il n'existe rien d'individuel, d'évolutif, et de non-prescriptif. Pétille comble ce trou.

---

## Ce que Pétille fait (et ne fait pas)

### ✅ Pétille fait

- Propose un **questionnaire ludique** adapté à la tranche d'âge (6-8 ans et 9-11 ans)
- **Archive chaque passage** et permet de comparer les sessions d'une année sur l'autre
- Génère un **rappel calendrier** (.ics) pour refaire le questionnaire l'année suivante
- Exporte un **PDF souvenir** à relire plus tard avec l'enfant
- Fonctionne **hors-ligne** après la première visite (PWA installable)
- S'installe sur **iOS, Android et ordinateur** sans passer par un app store

### ❌ Pétille ne fait pas

- **Ne suggère aucun métier.** Jamais. Même pas "tu pourrais être architecte". L'outil s'arrête au profil d'appétences.
- **Ne stocke rien sur un serveur.** Toutes les données restent sur l'appareil du parent, exportables dans son propre cloud personnel.
- **Ne demande aucun compte ni email.** Ouvrir la page, c'est commencer.
- **Ne tracke rien.** Aucun analytics, aucun pixel, aucune télémétrie.
- **Ne prétend pas être un outil psychométrique.** C'est un miroir ludique, pas un test d'orientation scientifique.
- **Ne remplace pas un dialogue.** Les meilleures questions se posent entre l'enfant et un adulte bienveillant ; Pétille donne juste un cadre.

---

## Principes fondateurs

1. **Aucun métier suggéré, jamais** — l'enfant reste libre de se projeter
2. **Évolutif dans le temps** — la valeur vient de la comparaison entre passages
3. **Données chez le parent** — zéro serveur, zéro compte, zéro tracking
4. **Libre et auto-hébergeable** — code ouvert, build statique, AGPLv3
5. **Mobile-first** — c'est sur le téléphone du parent que ça se passe
6. **Zéro friction** — utilisable en 30 secondes, sans lecture de doc
7. **Anti-gamification creuse** — pas de badges, pas de points, pas de "niveaux"
8. **Accessible** — lecture à voix haute, contrastes AA, tailles confortables

---

## Utilisation

### Pour un parent

1. Ouvrez [pétille.app](#) dans le navigateur de votre téléphone ou ordinateur
2. Ajoutez votre enfant (prénom + année de naissance)
3. Lancez le questionnaire. 15 à 25 minutes selon l'âge.
4. À la fin, exportez le fichier `.json` dans votre cloud personnel (iCloud Drive, Google Drive, Dropbox, etc.)
5. Ajoutez l'événement `.ics` à votre calendrier — Pétille vous rappellera dans un an
6. L'année suivante, rechargez votre fichier et refaites le questionnaire. Comparez les deux.

### Pour une école ou un animateur

Pétille est pensé pour un usage **individuel famille par famille**. Un usage collectif en classe demanderait des adaptations (gestion multi-enfants, anonymisation, export groupé) qui ne sont pas encore implémentées. Voir la [roadmap](#roadmap).

---

## Self-hosting

Pétille est une application statique. Un serveur web suffit.

### Avec Docker

```bash
git clone https://github.com/[user]/petille.git
cd petille
docker compose up -d
```

Le service est exposé sur `http://localhost:8080`.

### Avec Traefik

Un exemple de `docker-compose.yml` avec labels Traefik est fourni dans le dossier [`deploy/`](deploy/).

### Sur tout autre hébergeur statique

Après `npm run build`, le dossier `dist/` contient tout ce qu'il faut. Servir avec n'importe quel serveur HTTP (nginx, caddy, Apache) ou tout hébergeur statique **souverain** (pas Cloudflare Pages, pas Vercel — préférez Scaleway, OVH, ou du self-hosted).

---

## Développement local

Prérequis : **Node.js 20+** et **pnpm**.

```bash
git clone https://github.com/[user]/petille.git
cd petille
pnpm install
pnpm dev
```

L'application tourne sur `http://localhost:5173`.

### Scripts disponibles

```bash
pnpm dev          # serveur de dev avec HMR
pnpm build        # build de production dans dist/
pnpm preview      # prévisualiser le build
pnpm test         # tests unitaires (Vitest)
pnpm lint         # linter ESLint
pnpm typecheck    # vérification TypeScript
```

---

## Architecture

### Stack

- **Vue 3** (Composition API) + **TypeScript**
- **Vite** comme bundler
- **Tailwind CSS** (compilé au build, zéro CDN runtime)
- **vite-plugin-pwa** pour l'installation et l'offline
- **idb-keyval** pour la persistance locale (IndexedDB)
- **jsPDF** pour l'export PDF
- **ics** pour la génération du rappel calendrier

### Absences remarquables

- ❌ Aucune dépendance runtime vers un CDN tiers
- ❌ Aucun appel réseau pendant l'utilisation
- ❌ Aucun analytics, aucun tracker
- ❌ Aucune API externe

### Flux de données

```
Parent
  │
  ├──► Navigateur (IndexedDB local)
  │       │
  │       ├──► Export JSON ──► Cloud personnel du parent
  │       ├──► Export PDF  ──► Archivage souvenir
  │       └──► Export .ics ──► Calendrier du parent (rappel annuel)
  │
  └──► Aucun serveur. Aucune base de données. Aucun compte.
```

### Format de données

Un fichier JSON versionné par famille, contenant les enfants et leurs sessions successives. Voir [`docs/data-format.md`](docs/data-format.md) pour la spec complète.

---

## Roadmap

### V1 (actuel, en développement)

- [ ] Questionnaire 6-8 ans
- [ ] Questionnaire 9-11 ans
- [ ] Persistance locale (IndexedDB)
- [ ] Import / Export JSON
- [ ] Export PDF souvenir
- [ ] Génération .ics (rappel annuel)
- [ ] Comparatif entre deux sessions
- [ ] PWA installable
- [ ] Accessibilité WCAG AA

### V2 (plus tard)

- [ ] Radar chart des familles d'appétences
- [ ] Mode enseignant / animateur (multi-enfants anonymisés)
- [ ] Internationalisation (EN en premier)
- [ ] Synchronisation E2E entre appareils d'une même famille (optionnelle)

### V3 (éventuel)

- [ ] Version 12-14 ans qui prépare la bascule vers Avenir(s)
- [ ] Intégration avec les ressources RESO d'Avenir(s)

### Jamais

- ❌ Suggestion de métiers
- ❌ Compte obligatoire
- ❌ Tracking ou analytics
- ❌ Monétisation par la donnée
- ❌ Dépendance à un cloud américain

---

## Alternatives et complémentarité

Pétille n'a pas vocation à remplacer les outils existants, mais à combler un trou d'âge :

| Âge | Outil recommandé |
|---|---|
| 6-11 ans | **Pétille** |
| 12-18 ans | [Avenir(s)](https://avenirs.onisep.fr/) (Onisep, officiel) |
| 12+ complément | [Wilbi](https://wilbi.me/) (vidéos métiers) |
| 14-25 ans | [JobIRL](https://www.jobirl.com/) (réseau pros) |
| 15-25 ans | [Hello Charly](https://hello-charly.com/) (chatbot) |

La philosophie Pétille : quand l'enfant atteint 12 ans, on exporte le PDF souvenir, on bascule vers Avenir(s), et on garde le carnet comme trace précieuse des années précédentes.

---

## Contribuer

Les contributions sont les bienvenues, avec quelques lignes rouges :

### ✅ Bienvenu

- Corrections de bugs
- Améliorations d'accessibilité
- Traductions (en privilégiant la qualité de l'adaptation culturelle à la rapidité)
- Propositions d'évolution du questionnaire basées sur des retours terrain
- Amélioration des textes d'accompagnement pour l'adulte
- Améliorations de performance
- Documentation

### ❌ Refusé

- Toute feature qui ajoute un backend
- Toute feature qui ajoute du tracking, même "optionnel"
- Toute feature qui suggère un métier à l'enfant
- Toute dépendance à un service cloud tiers (Cloudflare, Vercel, Firebase…)
- Toute feature de gamification (badges, points, progression gamifiée)

### Processus

1. Ouvrir une [Discussion](../../discussions) avant d'ouvrir une PR pour les changements non-triviaux
2. Les PR de code doivent passer le linter, le typecheck et les tests
3. Les PR touchant le questionnaire doivent inclure une justification (retour d'usage, source citée, etc.)

Voir [`CONTRIBUTING.md`](CONTRIBUTING.md) pour les détails.

---

## Licence

Pétille est publié sous licence **[AGPL v3](LICENSE)**.

Ce choix est volontaire : si quelqu'un améliore l'outil pour le proposer en SaaS, les améliorations doivent revenir à la communauté. Pour un projet destiné aux enfants, cette exigence est cohérente.

---

## Auteur

**Benjamin** — développeur et architecte freelance à Bordeaux.

25 ans dans la tech — développeur, lead, architecte. Stack principale aujourd'hui : Go, Vue 3, PostgreSQL, Docker. Je travaille en freelance sous le nom commercial **Kolapsis** et j'interviens notamment comme CTO à temps partiel chez **NéoDTX**. J'ai aussi 16 ans d'enseignement au CESI et chez Ynov derrière moi.

Je défends une approche pragmatique de la tech : souveraineté numérique, self-hosting, code ouvert, zéro bullshit.

**Pourquoi ce projet ?** J'ai deux filles de 6 et 8 ans. Comme beaucoup de parents, j'ai observé qu'elles connaissent cinq métiers et que les stéréotypes se fixent vite. J'ai cherché un outil pour garder la fenêtre ouverte. Les solutions existantes sont solides mais démarrent au collège. Entre 6 et 11 ans, il n'y a rien. Alors je l'ai construit.

Le code est public. Les données restent chez vous. Aucun compte, aucun tracking, aucun serveur n'est nécessaire pour utiliser l'outil.

- 🌐 [kolapsis.com](https://kolapsis.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/[profil])
- 🐙 [GitHub](https://github.com/[user])

---

## Remerciements

- À l'**Onisep** pour le travail remarquable sur [Avenir(s)](https://avenirs.onisep.fr/), qui prend le relais à 12 ans.
- Aux équipes de **Wilbi**, **Hello Charly**, **JobIRL** pour avoir mis l'orientation au niveau des jeunes.
- Aux chercheurs en psychologie du développement (Gottfredson, Super et leurs travaux sur la construction des intérêts professionnels) dont les études de fond informent la démarche sans être citées partout.
- Aux deux petites bêtas-testeuses involontaires qui, à 6 et 8 ans, ont inspiré tout ça.

---

<div align="center">

**Pétille est un outil. L'essentiel reste la conversation entre l'enfant et les adultes qui l'aiment.**

</div>
