/**
 * Questionnaire 6-8 ans, version 1.
 * Source : `questionnaire-metiers-enfants-6-8-ans.md` à la racine du repo.
 * Toute modification = bump de version et nouveau fichier (6-8-v2.ts).
 */
import type { Questionnaire } from './types';

export const questionnaire68v1: Questionnaire = {
  version: '6-8-v1',
  minAge: 6,
  maxAge: 8,
  estimatedMinutes: 18,
  intro:
    "Pas de bonne ou mauvaise réponse. Pas de jugement. On peut répondre 'les deux' ou 'ni l'un ni l'autre'.",
  steps: [
    {
      kind: 'themes-pair',
      title: "Qu'est-ce qui t'intéresse dans le monde ?",
      intro:
        'Pour chaque paire, choisis ce que tu préfères. Tu peux choisir les deux si tu aimes autant.',
      pairs: [
        {
          pairId: 'p1',
          left: { key: 'animals', emoji: '🐶', label: 'Les animaux' },
          right: {
            key: 'plants',
            emoji: '🌳',
            label: 'Les plantes, la forêt, les jardins',
          },
        },
        {
          pairId: 'p2',
          left: { key: 'space', emoji: '⭐', label: "Les étoiles et l'espace" },
          right: { key: 'ocean', emoji: '🌊', label: "La mer et ce qu'il y a dedans" },
        },
        {
          pairId: 'p3',
          left: {
            key: 'machines',
            emoji: '🚗',
            label: 'Les machines qui bougent (voitures, avions, robots)',
          },
          right: { key: 'buildings', emoji: '🏠', label: 'Les maisons et les bâtiments' },
        },
        {
          pairId: 'p4',
          left: {
            key: 'drawing',
            emoji: '🎨',
            label: 'Dessiner, peindre, inventer des choses belles',
          },
          right: { key: 'stories', emoji: '📚', label: 'Lire et écouter des histoires' },
        },
        {
          pairId: 'p5',
          left: { key: 'music', emoji: '🎵', label: 'La musique et les sons' },
          right: { key: 'movement', emoji: '💃', label: 'Danser, bouger, faire du sport' },
        },
        {
          pairId: 'p6',
          left: {
            key: 'puzzles',
            emoji: '🧩',
            label: 'Les énigmes et les jeux de réflexion',
          },
          right: {
            key: 'investigation',
            emoji: '🔍',
            label: 'Chercher comment les choses marchent',
          },
        },
        {
          pairId: 'p7',
          left: {
            key: 'caring_young',
            emoji: '👶',
            label: "M'occuper des plus petits que moi",
          },
          right: {
            key: 'helping',
            emoji: '🤝',
            label: "Aider quelqu'un qui a un problème",
          },
        },
        {
          pairId: 'p8',
          left: { key: 'cooking', emoji: '🍪', label: 'Cuisiner, goûter, sentir' },
          right: {
            key: 'experiments',
            emoji: '🧪',
            label: 'Faire des mélanges et des expériences',
          },
        },
        {
          pairId: 'p9',
          left: { key: 'travel', emoji: '🗺️', label: 'Les autres pays et les voyages' },
          right: {
            key: 'history',
            emoji: '🏛️',
            label: 'Les histoires du passé (dinosaures, chevaliers, rois…)',
          },
        },
        {
          pairId: 'p10',
          left: {
            key: 'small_animals',
            emoji: '🐝',
            label: 'Les petites bêtes (insectes, fourmis, abeilles)',
          },
          right: {
            key: 'big_animals',
            emoji: '🦁',
            label: 'Les grands animaux (lions, éléphants, baleines)',
          },
        },
      ],
    },
    {
      kind: 'actions',
      title: "Qu'est-ce que tu aimes FAIRE ?",
      intro:
        'Coche tout ce qui te ressemble. Pas ce que tu voudrais bien être. Ce que tu fais déjà.',
      groups: [
        {
          key: 'all',
          title: 'Choisis tout ce qui te ressemble',
          items: [
            { key: 'invent', label: "J'invente des histoires, des jeux, des personnages" },
            {
              key: 'build',
              label: 'Je construis des trucs (Lego, cabanes, assemblages)',
            },
            { key: 'repair', label: 'Je répare ce qui est cassé' },
            { key: 'explain', label: "J'explique aux autres quand ils ne comprennent pas" },
            { key: 'console', label: "Je console quand quelqu'un est triste" },
            { key: 'care', label: 'Je soigne les bobos (animaux, copains, poupées)' },
            { key: 'organize', label: "Je range, j'organise, je fais des équipes" },
            { key: 'search', label: 'Je cherche, je fouille, je veux comprendre pourquoi' },
            {
              key: 'move',
              label: 'Je bouge, je cours, je grimpe, je ne tiens pas en place',
            },
            { key: 'draw', label: 'Je dessine, je peins, je crée avec mes mains' },
            { key: 'count', label: 'Je compte, je calcule, je mesure' },
            {
              key: 'music',
              label: "Je chante, je joue d'un instrument, je fais des rythmes",
            },
            {
              key: 'talk',
              label: "Je parle, je raconte, j'aime bien qu'on m'écoute",
            },
            { key: 'observe', label: 'J\'observe, je regarde longtemps avant de faire' },
            { key: 'make_laugh', label: 'Je rigole, je fais rire les autres' },
          ],
        },
      ],
    },
    {
      kind: 'context',
      title: 'Où et avec qui tu es bien ?',
      intro: 'Choisis la réponse qui te ressemble le plus.',
      questions: [
        {
          key: 'social',
          label: 'Je préfère…',
          options: [
            { key: 'alone', emoji: '🧍', label: 'Tout seul dans mon coin' },
            { key: 'small_group', emoji: '👫', label: 'Avec un ou deux copains' },
            { key: 'big_group', emoji: '👨\u200d👩\u200d👧\u200d👦', label: 'Avec plein de monde' },
          ],
        },
        {
          key: 'space',
          label: 'Je préfère…',
          options: [
            {
              key: 'outside',
              emoji: '🌲',
              label: 'Dehors, dans la nature ou dans la rue',
            },
            { key: 'inside', emoji: '🛋️', label: "Dedans, à l'abri" },
            { key: 'mix', emoji: '🔄', label: 'Ça dépend des jours' },
          ],
        },
        {
          key: 'pace',
          label: 'Je préfère quand…',
          options: [
            { key: 'calm', emoji: '😌', label: "C'est calme et tranquille" },
            {
              key: 'fast',
              emoji: '⚡',
              label: 'Ça bouge, ça va vite, il se passe plein de choses',
            },
            { key: 'mix', emoji: '🎛️', label: 'Un mélange des deux' },
          ],
        },
        {
          key: 'novelty',
          label: 'Je préfère…',
          options: [
            {
              key: 'familiar',
              emoji: '🔁',
              label: 'Refaire ce que je sais déjà bien faire',
            },
            {
              key: 'new_each_time',
              emoji: '🆕',
              label: 'Essayer quelque chose de nouveau à chaque fois',
            },
          ],
        },
        {
          key: 'decision',
          label: 'Je préfère…',
          options: [
            { key: 'self', emoji: '🧑', label: 'Décider tout seul' },
            { key: 'adult', emoji: '👨\u200d🏫', label: "Qu'un adulte m'explique ce qu'il faut faire" },
            { key: 'together', emoji: '🤝', label: 'Décider avec les autres' },
          ],
        },
        {
          key: 'problem_solving',
          label: "Quand j'ai un problème difficile…",
          options: [
            { key: 'think_long', emoji: '🧠', label: "J'aime bien réfléchir longtemps avant" },
            {
              key: 'try_until_works',
              emoji: '🏃',
              label: "J'essaie plein de choses jusqu'à ce que ça marche",
            },
            { key: 'ask_help', emoji: '🙋', label: "Je demande de l'aide tout de suite" },
          ],
        },
      ],
    },
    {
      kind: 'magic-day',
      title: 'La grande question imaginaire',
      intro:
        "Imagine. Demain matin, c'est une journée magique. Tu peux faire tout ce que tu préfères au monde.",
      fields: [
        { key: 'what', label: 'Tu fais quoi ?', multiline: true, placeholder: 'Raconte…' },
        {
          key: 'where',
          label: 'Tu es où ?',
          placeholder: 'Dehors, dedans, dans quel endroit ?',
        },
        {
          key: 'with_whom',
          label: 'Tu es avec qui ?',
          placeholder: 'Seul, famille, copains, animaux ?',
        },
        {
          key: 'pride',
          label: "Le soir, qu'est-ce qui te rend fier ?",
          multiline: true,
        },
      ],
      allowPhoto: true,
      closingNote:
        "Si tu as fait un dessin de ta journée magique, prends-le en photo : on le gardera avec tes réponses.",
    },
  ],
  adultClosing:
    "Il existe PLEIN de façons différentes de faire vivre ce que tu aimes. On garde cette page : on regardera plus tard comment ça évolue. Pour l'instant, tu n'as rien à choisir.",
};
