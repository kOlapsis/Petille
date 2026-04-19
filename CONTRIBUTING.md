# Contribuer à Pétille

Merci pour l'intérêt que vous portez à Pétille. Ce document décrit comment proposer
des corrections, améliorations ou traductions.

## Principes non-négociables

Toute contribution doit respecter ces règles. Une PR qui les enfreint sera fermée.

1. **Aucune suggestion de métier**, nulle part, jamais. Pas dans l'UI, pas dans les
   exports, pas dans les commentaires visibles à l'enfant.
2. **Zéro backend, zéro tracking, zéro compte**. Toutes les données restent sur
   l'appareil de l'utilisateur.
3. **Accessibilité WCAG AA minimum** sur toute nouvelle UI.
4. **Stack européenne / auto-hébergeable**. Pas de dépendance à un SaaS US.
5. **Bundle initial < 500 KB gzippé**. Le script `pnpm check:bundle` doit rester vert.

## Environnement de développement

Prérequis : Node ≥ 20, pnpm ≥ 9.

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck
pnpm test         # Vitest
pnpm test:e2e     # Playwright (installe chromium au 1er lancement)
pnpm build        # SSG + sitemap
pnpm check:bundle # vérifie le budget gzip
```

## Structure du projet

- `src/lib/` — code pur, testable sans DOM (schema, profile scoring, crypto, pdf, ics).
- `src/stores/` — Pinia (carnet famille + session courante).
- `src/content/questionnaires/` — source unique des questionnaires 6-8 et 9-11.
- `src/views/public/` — pages SSG indexées (Home, About, FAQ, Blog).
- `src/views/app/` — application non-SSG (onboarding, dashboard, questionnaire…).
- `src/components/` — briques UI réutilisables.
- `deploy/` — Dockerfile + Caddyfile + docker-compose Traefik.

## Workflow

1. Forker et créer une branche thématique (`feat/`, `fix/`, `doc/`, …).
2. Écrire/ajuster des tests (Vitest pour la logique, Playwright pour les parcours).
3. `pnpm typecheck && pnpm test && pnpm build && pnpm check:bundle`.
4. Ouvrir une PR en décrivant le **pourquoi** et les garde-fous respectés.
5. La CI vérifie lint + typecheck + unit + build + bundle + E2E.

## Proposer un changement dans les questionnaires

Les versions des questionnaires sont **immutables** (`6-8-v1`, `9-11-v1`). Un changement
qui altère la sémantique d'une question oblige à créer une nouvelle version
(`6-8-v2`, par exemple) et à écrire une migration dans `src/lib/exporters/importJson.ts`.

Les corrections typographiques ou d'emoji qui ne changent pas la clé stable sont
acceptables sur la version en cours.

## Licence

En contribuant, vous acceptez que votre code soit diffusé sous licence **AGPL-3.0-or-later**,
comme le reste du projet.
