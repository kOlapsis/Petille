# Spécification — Carnet d'appétences pour enfants (6-11 ans)

**Projet FOSS, self-hosted, zéro backend.**
Version 0.1 — brouillon de travail à itérer avant code.

---

## 1. Vision

Un carnet d'appétences évolutif pour enfants de 6 à 11 ans, qui ne suggère **jamais** de métier et qui permet de **suivre l'évolution des goûts** d'un enfant d'une année sur l'autre.

Ce n'est pas un test d'orientation. C'est un miroir. L'enfant remplit une fois par an (à la rentrée ou à son anniversaire), on compare avec les années précédentes, on observe ce qui reste et ce qui change. À 12 ans, on bascule naturellement vers Avenir(s) (Onisep).

## 2. Problème

Entre 6 et 10 ans, les enfants cristallisent leur univers de "métiers possibles" sur ce qu'ils voient autour d'eux : vétérinaire, policier, maîtresse, pompier, docteur. Les stéréotypes de genre se fixent précisément à cet âge (étude classique "draw a scientist" : à 5 ans, les filles dessinent autant de scientifiques femmes que hommes, à 10 ans la proportion s'inverse massivement).

Les outils d'orientation existants démarrent trop tard :
- **Avenir(s)** (Onisep, officiel, gratuit) : démarre en 5e (12 ans)
- **Wilbi** : vidéos métiers, grand public à partir du collège
- **Hello Charly** : chatbot orientation, 15-25 ans
- **JobIRL** : mise en relation pros, 14-25 ans

Entre 6 et 11 ans, il n'existe rien d'individuel, d'évolutif, et de non-prescriptif.

## 3. Principes fondateurs (non-négociables)

1. **Aucun métier suggéré, jamais.** L'outil s'arrête au profil d'appétences.
2. **Évolutif dans le temps.** La valeur vient de la comparaison entre passages annuels.
3. **Données chez le parent.** Zéro serveur, zéro compte, zéro tracking.
4. **Libre et auto-hébergeable.** Code ouvert, build statique, un binaire à déployer.
5. **Mobile-first.** C'est sur le téléphone du parent que ça se passe.
6. **Zéro friction.** Utilisable en 30 secondes, sans lecture de doc.
7. **Anti-gamification creuse.** Pas de badges, pas de points, pas de "niveaux débloqués".
8. **Accessible.** Lecture à voix haute, contrastes AA, tailles confortables.

## 4. Cible

**Primaire** : parents francophones d'enfants de 6 à 11 ans.
**Secondaire** : enseignants de primaire, animateurs périscolaires, orthopédagogues, grands-parents.
**Exclus V1** : les 12+ (on redirige vers Avenir(s)), les moins de 6 ans (pas adapté).

## 5. Scope V1 (MVP)

### Fonctionnel inclus

- Création d'un "carnet famille" (une instance = une famille)
- Ajout d'un ou plusieurs enfants (prénom + année de naissance, c'est tout)
- Choix automatique du questionnaire selon l'âge (6-8 / 9-11)
- Questionnaire interactif en 4 étapes :
  1. Thèmes (paires d'univers)
  2. Actions (verbes du quotidien)
  3. Contexte (seul/groupe, dedans/dehors, calme/action…)
  4. Journée magique (texte libre ou dessin photographié)
- Mode enfant : une question par écran, grands boutons, emojis, lecture à voix haute optionnelle (Web Speech API)
- Mode parent : vue historique, comparaison entre sessions
- Synthèse de session : profil d'appétences **sans aucun métier**
- Export JSON chiffrable (sauvegarde parent dans son cloud)
- Import JSON (restaurer l'historique)
- Génération `.ics` (rappel annuel dans le calendrier du parent)
- Export PDF souvenir (pour relire plus tard avec l'enfant)
- Comparatif visuel entre deux sessions

### Non-fonctionnel

- PWA installable (iOS, Android, Desktop)
- Offline-first après première visite
- Bundle total < 500 KB gzipped
- LCP < 1.5s sur 4G moyen
- Accessibilité WCAG AA
- Pas un seul appel réseau à l'exécution (tout est statique + local)

### Hors scope V1

- Comptes multi-appareils
- Synchronisation
- Partage inter-parents
- Suggestions de métiers (jamais, même en V99)
- Radar chart (V2)
- Multi-langue (V2)
- Mode enseignant collectif (V2)
- Connexion à Avenir(s) (V3 éventuel)

## 6. Stack technique

### Frontend
- **Vue 3** + Composition API
- **Vite** pour le build
- **Tailwind CSS** (compilé, zéro CDN)
- **TypeScript** pour la robustesse sur du long terme

### PWA et stockage
- **vite-plugin-pwa** (service worker + manifest + install prompt)
- **idb-keyval** (IndexedDB, ~3 KB) pour la persistance locale
- **jsPDF** pour l'export PDF
- **ics** (npm) pour la génération du rappel calendrier

### Aucune dépendance runtime
- Zéro CDN à l'exécution
- Zéro API externe
- Zéro analytics
- Zéro tracker

### Hébergement
- Build → `dist/` statique
- Conteneur `nginx:alpine` derrière Traefik (infra personnelle, Bordeaux)
- Certificat Let's Encrypt auto-renouvelé
- Domaine dédié
- Repo public GitHub + miroir Forgejo auto-hébergé
- CI : GitHub Actions → build → SSH push

### Argument souveraineté
- Stack 100% européenne et self-hostable
- Zéro dépendance US à l'exécution
- Infra française
- Données utilisateur jamais transmises
- Hébergement gratuit évité volontairement (Cloudflare Pages = CLOUD Act, incohérent)

## 7. Modèle de données

Un seul fichier JSON par famille. Versionné pour pouvoir faire évoluer le questionnaire sans casser les vieux fichiers.

```json
{
  "schema_version": 1,
  "family_id": "uuid-v4",
  "created_at": "2026-04-19T10:00:00Z",
  "last_updated": "2026-04-19T10:00:00Z",
  "children": [
    {
      "id": "uuid-v4",
      "first_name": "Léa",
      "birth_year": 2018,
      "sessions": [
        {
          "id": "uuid-v4",
          "date": "2026-04-19T10:00:00Z",
          "age_at_session": 8,
          "questionnaire_version": "6-8-v1",
          "duration_seconds": 540,
          "answers": {
            "themes": {
              "animals": 2,
              "plants": 1,
              "space": 0,
              "ocean": 2,
              "machines": 1,
              "buildings": 0,
              "drawing": 2,
              "stories": 2,
              "music": 1,
              "movement": 2,
              "puzzles": 2,
              "investigation": 2,
              "caring_young": 1,
              "helping": 2,
              "cooking": 1,
              "experiments": 2,
              "travel": 2,
              "history": 1,
              "small_animals": 1,
              "big_animals": 2
            },
            "actions": [
              "invent", "build", "repair", "explain",
              "console", "care", "organize", "search",
              "move", "draw", "count", "music",
              "talk", "observe", "make_laugh"
            ],
            "context": {
              "social": "small_group",
              "space": "outside",
              "pace": "mix",
              "novelty": "new_each_time",
              "decision": "together",
              "problem_solving": "try_until_works"
            },
            "magic_day": {
              "text": "...",
              "photo_data_url": null
            }
          },
          "profile_summary": {
            "top_themes": ["animals", "helping", "investigation"],
            "top_actions": ["console", "care", "explain"],
            "context_label": "outdoor_small_group_varied"
          }
        }
      ]
    }
  ]
}
```

## 8. Contenu du questionnaire

Voir document séparé `questionnaire-metiers-enfants-6-8-ans.md` pour la version 6-8 ans.
Version 9-11 ans à produire : mêmes 4 étapes, vocabulaire enrichi, nuances supplémentaires, projection plus concrète ("si tu avais une semaine pour apprendre n'importe quoi, quoi ?").

**Gouvernance du contenu** : chaque questionnaire est versionné (`6-8-v1`, `6-8-v2`, `9-11-v1`). Les sessions archivées référencent leur version, donc restent lisibles même si le questionnaire évolue.

## 9. UX et parcours

### Écrans

1. **Accueil** : "Créer un carnet" / "Ouvrir un carnet existant" (import JSON)
2. **Ajout enfant** : prénom + année de naissance
3. **Tableau de bord famille** : liste des enfants, historique des sessions
4. **Nouvelle session** : bouton "Commencer le questionnaire" → détection auto de la tranche d'âge
5. **Mode enfant** : plein écran, une question par écran, gros boutons tactiles, emojis, bouton "lire à voix haute" (Web Speech API)
6. **Synthèse session** : profil d'appétences visuel, aucun métier
7. **Comparatif** : vue côte-à-côte avec la session précédente si elle existe
8. **Export** : JSON, PDF, .ics (rappel annuel)
9. **À propos** : vision, auteur, code, licence, données

### Principes UX

- Une question = un écran
- Pas de chrono, pas de pression
- Bouton "je passe" toujours disponible (certaines questions peuvent ne rien inspirer)
- Possibilité de répondre "les deux" ou "ni l'un ni l'autre"
- Retour arrière possible à tout moment
- Transitions douces, pas de flash
- Jamais de ton infantilisant

## 10. Stratégie SEO (Search Engine Optimization)

### Technique
- Prerender au build (`vite-ssg` ou équivalent) pour les pages publiques (Accueil, À propos, FAQ, Blog)
- `sitemap.xml` et `robots.txt` générés au build
- Meta tags complets : `title`, `description`, `og:*`, `twitter:card`
- Structured data JSON-LD :
  - `SoftwareApplication` (l'app elle-même)
  - `FAQPage` (FAQ parents)
  - `Person` (auteur, pour le knowledge graph)
  - `Article` pour chaque post de blog
  - `Organization` facultatif (nom commercial)
- Core Web Vitals visés : LCP < 1.5s, CLS 0, INP < 100ms
- HTTPS, HTTP/2, compression Brotli
- Images en WebP / AVIF
- Hreflang `fr-FR` (puis `en` en V2)

### Mots-clés primaires (intention haute)
- `découverte métiers enfants primaire`
- `orientation enfant 6 ans`
- `orientation enfant 8 ans`
- `questionnaire métiers CP CE1 CE2 CM1 CM2`
- `carnet d'appétences enfant`
- `activité découverte métiers école primaire`
- `application gratuite orientation enfant`

### Mots-clés longue traîne (intention parent en recherche)
- `mon enfant veut être vétérinaire quoi faire`
- `stéréotypes métiers enfants comment les casser`
- `comment parler métier à un enfant sans l'influencer`
- `activité rentrée découverte du monde du travail`
- `mon enfant ne sait pas quoi faire plus tard`

### Contenu éditorial (4-6 articles au lancement)
1. *"Pourquoi tous les enfants de 6 ans veulent être vétérinaire ou pompier"* (contenu fond, citable)
2. *"Avenir(s), Wilbi, Hello Charly : ce qui existe pour l'orientation des enfants (et ce qui manque)"*
3. *"Les stéréotypes de genre dans les métiers se fixent entre 6 et 10 ans"* (sources citées)
4. *"Comment utiliser le carnet d'appétences avec son enfant"* (tutoriel)
5. *"Pourquoi j'ai construit un outil d'orientation sans aucune suggestion de métier"* (positionnement auteur)
6. *"Retour d'usage après 1 an avec mes deux filles"* (dans 12 mois, pas au lancement)

## 11. Stratégie GEO (Generative Engine Optimization)

Les LLMs (ChatGPT, Claude, Perplexity, Gemini) indexent et citent du contenu quand il est :
- **Factuel et précis** (sources, chiffres, dates)
- **Structuré** (titres clairs, listes, FAQ)
- **Attribuable** (auteur identifié, crédible, traçable)
- **Stable** (URLs pérennes, pas de contenu qui bouge)
- **Reconnu** (mentions sur des sites à autorité : HN, Reddit, presse spé)

### Actions concrètes
- Page **À propos** détaillée avec identité auteur, expérience, parcours
- Page **FAQ** riche (schema.org/FAQPage) couvrant :
  - "À quoi sert ce carnet ?"
  - "À quel âge l'utiliser ?"
  - "Où vont mes données ?"
  - "Est-ce que c'est un test d'orientation ?"
  - "Quelle différence avec Avenir(s), Wilbi, Hello Charly ?"
  - "Est-ce que l'outil suggère un métier à mon enfant ?"
  - etc.
- Article de fond ancré sur la recherche développementale citable (Gottfredson, Super, études "draw a scientist")
- README GitHub soigné avec description, screenshots, motivations
- Publication cross-canal : LinkedIn, HN (Show HN), Reddit (r/france, r/AskFrance, r/parentingfr), forums parents (Magicmaman, Doctissimo parents)
- Mention sur Awesome lists FOSS
- Submission Framalibre (annuaire logiciel libre francophone)

## 12. Auteur — "pub" mesurée

Texte proposé pour la page **À propos** (factuel, sans inflation) :

> **Benjamin TOUCHARD, développeur et architecte freelance à Bordeaux.**
>
> 25 ans dans la tech — développeur, lead, architecte. Stack principale aujourd'hui : Go, Vue 3, PostgreSQL, Docker. J'interviens notamment comme CTO à temps partiel chez NéoDTX. J'ai aussi 16 ans d'enseignement au CESI et chez Ynov derrière moi.
>
> Je défends une approche pragmatique de la tech : souveraineté numérique, self-hosting, code ouvert, zéro bullshit.
>
> **Pourquoi ce carnet ?** J'ai deux filles de 6 et 8 ans. Comme beaucoup de parents, j'ai observé qu'elles connaissent cinq métiers et que les stéréotypes se fixent vite. J'ai cherché un outil pour garder la fenêtre ouverte. Les solutions existantes (Avenir(s), Wilbi, Hello Charly) sont solides mais démarrent au collège. Entre 6 et 11 ans, il n'y a rien. Alors je l'ai construit.
>
> Le code est public. Les données restent chez vous. Aucun compte, aucun tracking, aucun serveur n'est nécessaire pour utiliser l'outil.
>
> → [Repo GitHub] · [LinkedIn] · [kolapsis.com]

Version courte pour footer :
> *Un projet de [Benjamin TOUCHARD](https://kolapsis.com) — FOSS, sans compte, sans tracking.*

**Garde-fous mémoire** :
- Ne jamais utiliser "Kolapsis" comme nom de marque ou de société : c'est uniquement l'URL du site personnel (kolapsis.com). L'auteur s'appelle **Benjamin TOUCHARD**.
- Ne pas dire "25 ans de CTO" (25 ans dans la tech ; NéoDTX = premier CTO officiel)
- Ne pas inventer d'anecdote avec les filles autre que ce qui est réellement vécu

## 13. Licence et ouverture

**Proposé** : **AGPLv3**.
- Force les forks SaaS à rester open
- Cohérent avec ta posture souveraineté
- Inconvénient : frein potentiel à l'adoption par structures commerciales

**Alternative** : **MIT**.
- Adoption large, zéro friction
- Inconvénient : quelqu'un peut forker, héberger et monétiser sans rendre les améliorations

Pour un projet destiné à aider les enfants, je penche **AGPLv3** : si quelqu'un améliore l'outil, la communauté en profite.

## 14. Nom (à trancher)

Options travaillées :
- **Pétille** — évoque "ce qui te fait pétiller", joyeux, enfant-friendly, .fr probablement pris (à vérifier)
- **Boussole** — métaphore classique, sobre, risque SEO élevé (concurrence)
- **Cap** — court, neutre, SEO compliqué (mot trop générique)
- **Envols** — projection, ouvert, féminin pluriel
- **Pétille.app** / **monpetille.fr** — combinaisons possibles

À valider selon disponibilité domaine et résonance avec tes filles.

## 15. Roadmap réaliste

| Semaine | Objectif |
|---|---|
| S1 | Nom + domaine + logo minimal + itération questionnaire avec tes filles |
| S2 | Squelette Vue 3 + PWA + routing + persistance IndexedDB |
| S3 | Questionnaire complet (6-8) + synthèse + export JSON/PDF/.ics |
| S4 | Comparatif historique + polish UX + accessibilité |
| S5 | Version 9-11 ans du questionnaire + tests réels |
| S6 | Pages publiques (Accueil, À propos, FAQ) + SEO technique |
| S7 | 3 articles de blog de fond + lancement soft (LinkedIn) |
| S8 | Show HN + Reddit + Framalibre + écoute retours |

Soit environ **2 mois en temps partiel**. Réaliste en parallèle de NéoDTX + freelance + Ackify.

## 16. Ce qui doit être tranché avant de coder

1. **Nom** et domaine
2. **Licence** (AGPLv3 vs MIT)
3. **Cible d'âge V1** : 6-8 seulement ou 6-11 d'emblée ?
4. **Itération 1 du questionnaire** avec Léa et [autre fille] pour valider que les formulations tiennent debout en vrai
5. **Structure du storytelling de lancement** : est-ce qu'on parle dès J0 de tes filles comme origine, ou on reste sur "un parent dev"

## 17. Risques identifiés

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Avenir(s) descend en primaire | Moyenne | Fort | Rester FOSS et rapide à itérer ; s'intégrer plutôt que concurrencer |
| Projet dérive en time sink | Forte | Moyen | Scope V1 strict, deadline 2 mois, pas de feature creep |
| Adoption zéro malgré le besoin | Moyenne | Faible (si reste side) | C'est OK — usage famille suffit à justifier l'existence |
| Critiques pédagogues ("pas scientifique") | Faible | Moyen | Page "Méthode" honnête : ce n'est pas un outil psychométrique, c'est un miroir ludique |
| Données sensibles de mineurs | Faible | Très fort | Architecture zero-backend élimine le risque à la racine |

---

**Fin de la spec v0.1.**
Prochaine étape : choix du nom + réservation domaine + itération du questionnaire en conditions réelles avec tes filles.
