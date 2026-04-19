/**
 * Questionnaire 9-11 ans, version 1.
 * Source : `questionnaire-metiers-enfants-9-11-ans.md`.
 * Étape 1 = ratings 0-3 par section ; étape 4 = projections (semaine, lettre, modèles).
 */
import type { Questionnaire } from './types';

export const questionnaire911v1: Questionnaire = {
  version: '9-11-v1',
  minAge: 9,
  maxAge: 11,
  estimatedMinutes: 28,
  intro:
    "Pas de bonne ou mauvaise réponse. Toutes les réponses 'je sais pas' ou 'les deux' sont valides.",
  steps: [
    {
      kind: 'themes-rating',
      title: 'Tes univers',
      intro: 'Pour chaque ligne, note de 0 (ça ne m\'intéresse pas) à 3 (beaucoup).',
      scale: {
        min: 0,
        max: 3,
        labels: ['Pas du tout', 'Un peu', 'Bien', 'Beaucoup'],
      },
      sections: [
        {
          key: 'living_world',
          title: 'Le monde vivant',
          emoji: '🌍',
          items: [
            { key: 'animals', emoji: '🐾', label: 'Les animaux (comprendre comment ils vivent)' },
            { key: 'plants', emoji: '🌿', label: 'Les plantes, les arbres, les forêts' },
            { key: 'human_body', emoji: '🩺', label: 'Le corps humain, la santé, comment on guérit' },
            { key: 'microorg', emoji: '🦠', label: "Les micro-organismes, les virus, l'invisible" },
            { key: 'ecology', emoji: '🌱', label: "L'écologie, la nature, la protection de la planète" },
          ],
        },
        {
          key: 'science_tech',
          title: 'Les sciences et la technique',
          emoji: '🔬',
          items: [
            { key: 'space', emoji: '🪐', label: "L'espace, les planètes, l'univers" },
            { key: 'math', emoji: '🔢', label: 'Les mathématiques, les chiffres, les énigmes' },
            { key: 'machines', emoji: '⚙️', label: 'Les machines, les moteurs, comment ça marche' },
            { key: 'electronics', emoji: '🤖', label: "L'électronique, les ordinateurs, les robots" },
            { key: 'experiments', emoji: '🧪', label: 'Les expériences, les mélanges, la chimie' },
          ],
        },
        {
          key: 'creation',
          title: 'La création',
          emoji: '🎨',
          items: [
            { key: 'drawing', emoji: '🎨', label: 'Dessiner, peindre, illustrer' },
            { key: 'writing', emoji: '✍️', label: 'Écrire, inventer des histoires, des personnages' },
            { key: 'building', emoji: '🛠️', label: 'Construire, bricoler, assembler' },
            { key: 'music', emoji: '🎵', label: 'La musique (écouter, jouer, composer)' },
            { key: 'video', emoji: '🎬', label: 'La vidéo, les films, le montage' },
            { key: 'photo', emoji: '📷', label: 'La photo, le design, les belles images' },
            { key: 'gamedev', emoji: '🎮', label: 'Les jeux vidéo (en comprendre la fabrication)' },
          ],
        },
        {
          key: 'humans',
          title: 'Les humains',
          emoji: '🧑\u200d🤝\u200d🧑',
          items: [
            { key: 'helping', emoji: '🤝', label: "Aider quelqu'un qui a un problème" },
            { key: 'teaching', emoji: '👩\u200d🏫', label: "Expliquer, enseigner à d'autres" },
            { key: 'caring', emoji: '👶', label: "M'occuper des plus petits ou des personnes âgées" },
            { key: 'understanding', emoji: '💭', label: 'Comprendre pourquoi les gens pensent différemment' },
            { key: 'convincing', emoji: '🗣️', label: 'Convaincre, défendre une idée' },
            { key: 'organizing', emoji: '📋', label: 'Organiser un groupe, répartir les rôles' },
          ],
        },
        {
          key: 'world_past',
          title: 'Le monde et le passé',
          emoji: '🗺️',
          items: [
            { key: 'travel', emoji: '✈️', label: 'Les autres pays, les cultures, les voyages' },
            { key: 'history', emoji: '🏛️', label: "L'histoire (dinosaures, Égypte, Moyen Âge…)" },
            { key: 'geography', emoji: '🗺️', label: 'La géographie, les cartes, les paysages' },
            { key: 'politics', emoji: '⚖️', label: "La politique, la justice, comment la société s'organise" },
            { key: 'languages', emoji: '🗣️', label: 'Les langues étrangères' },
          ],
        },
        {
          key: 'body_action',
          title: "Le corps et l'action",
          emoji: '⚽',
          items: [
            { key: 'sport', emoji: '🏃', label: 'Le sport (pratiquer)' },
            { key: 'performing', emoji: '🎭', label: 'La danse, le cirque, le théâtre' },
            { key: 'rescue', emoji: '🚒', label: 'Les métiers du secours (pompiers, samu, montagne)' },
            { key: 'manual', emoji: '🪚', label: 'Les métiers manuels (cuisine, menuiserie, couture…)' },
            { key: 'wide_spaces', emoji: '🏔️', label: 'Les grands espaces (mer, montagne, campagne)' },
          ],
        },
      ],
    },
    {
      kind: 'actions',
      title: 'Tes façons de faire',
      intro: 'Coche tout ce qui te ressemble. Ce que tu fais déjà naturellement.',
      groups: [
        {
          key: 'problem_idea',
          title: "Avec un problème ou une idée :",
          items: [
            { key: 'think_long', label: 'Je réfléchis longtemps avant de faire' },
            { key: 'try_until_works', label: "J'essaie plein de trucs jusqu'à ce que ça marche" },
            { key: 'seek_info', label: "Je cherche de l'aide ou des infos" },
            { key: 'switch_when_stuck', label: "Je laisse tomber et je passe à autre chose si c'est bloqué" },
            { key: 'ask_many', label: 'Je demande à plusieurs personnes leur avis' },
            { key: 'find_workaround', label: 'Je trouve toujours une façon détournée de faire' },
          ],
        },
        {
          key: 'creating',
          title: 'Quand je crée quelque chose :',
          items: [
            { key: 'plan_first', label: "Je fais d'abord un plan, un dessin, une liste" },
            { key: 'jump_in', label: 'Je me lance direct et je vois en faisant' },
            { key: 'reproduce_model', label: 'Je préfère reproduire un modèle' },
            { key: 'invent_blank', label: 'Je préfère inventer à partir de rien' },
            { key: 'finish_clean', label: "J'aime finir proprement avant de montrer" },
            { key: 'show_early', label: "Je montre dès que c'est un peu prêt pour avoir des avis" },
          ],
        },
        {
          key: 'with_others',
          title: 'Avec les autres :',
          items: [
            { key: 'propose_ideas', label: 'Je propose des idées' },
            { key: 'complete_others', label: "J'écoute et je complète celles des autres" },
            { key: 'lead', label: 'Je mène le groupe naturellement' },
            { key: 'follow', label: "Je préfère qu'on me dise quoi faire" },
            { key: 'detect_distress', label: "Je repère quand quelqu'un va mal" },
            { key: 'make_laugh', label: "Je fais rire, je détends l'ambiance" },
            { key: 'work_alone', label: 'Je préfère travailler seul de mon côté' },
          ],
        },
        {
          key: 'learning',
          title: "Quand j'apprends :",
          items: [
            { key: 'read', label: "J'aime lire" },
            { key: 'watch_video', label: "J'aime regarder des vidéos" },
            { key: 'oral_explanation', label: "J'aime qu'on m'explique de vive voix" },
            { key: 'do_it_myself', label: "J'aime comprendre en faisant moi-même" },
            { key: 'ask_questions', label: "J'aime poser plein de questions" },
            { key: 'go_deep', label: "J'aime aller au bout d'un sujet, même compliqué" },
            { key: 'zap_when_bored', label: 'Je zappe vite si ça m\'ennuie' },
          ],
        },
        {
          key: 'frustrations',
          title: 'Ce qui me frustre vraiment :',
          items: [
            { key: 'wait', label: 'Attendre' },
            { key: 'repeat', label: 'Refaire la même chose plusieurs fois' },
            { key: 'no_meaning', label: "Ne pas comprendre pourquoi on fait un truc" },
            { key: 'no_decision', label: 'Ne pas pouvoir décider moi-même' },
            { key: 'long_sit', label: 'Rester assis trop longtemps' },
            { key: 'public_speak', label: 'Devoir parler devant beaucoup de monde' },
            { key: 'group_slow', label: 'Travailler en groupe quand ça traîne' },
            { key: 'long_alone', label: "Travailler seul quand c'est long" },
          ],
        },
      ],
    },
    {
      kind: 'context',
      title: 'Où et comment tu es bien',
      intro: 'Choisis la réponse qui te ressemble le plus aujourd\'hui.',
      questions: [
        {
          key: 'social',
          label: 'Je préfère…',
          options: [
            { key: 'alone', emoji: '🧍', label: 'Travailler seul, dans ma bulle' },
            { key: 'small_group', emoji: '👫', label: 'En binôme ou petite équipe (2-3)' },
            { key: 'big_group', emoji: '👨\u200d👩\u200d👧\u200d👦', label: 'En grand groupe' },
            { key: 'alternate', emoji: '🔄', label: 'Alterner selon les moments' },
          ],
        },
        {
          key: 'space',
          label: 'Mon environnement idéal :',
          options: [
            { key: 'outside', emoji: '🌲', label: "Dehors, bouger, changer d'endroit" },
            { key: 'inside', emoji: '🛋️', label: 'Dedans, stable, au calme' },
            { key: 'urban', emoji: '🏙️', label: 'Dans le mouvement, la ville, les gens' },
            { key: 'vary', emoji: '🔀', label: 'Varier souvent' },
          ],
        },
        {
          key: 'pace',
          label: 'Mon rythme :',
          options: [
            { key: 'slow_deep', emoji: '🐢', label: 'Lent, approfondi, je vais au fond' },
            { key: 'fast', emoji: '⚡', label: 'Rapide, intense, je passe vite au suivant' },
            { key: 'mix', emoji: '🎛️', label: 'Alterner selon les tâches' },
          ],
        },
        {
          key: 'novelty',
          label: 'Mon rapport à la nouveauté :',
          options: [
            { key: 'familiar', emoji: '🔁', label: 'Je préfère ce que je maîtrise déjà' },
            { key: 'new_each_time', emoji: '🆕', label: 'Je veux du nouveau en permanence' },
            { key: 'mix', emoji: '⚖️', label: 'Un mélange' },
          ],
        },
        {
          key: 'decision',
          label: "Mon rapport à l'autorité :",
          options: [
            { key: 'self', emoji: '🧑', label: 'Je préfère décider seul' },
            { key: 'adult', emoji: '👨\u200d🏫', label: 'J\'aime un cadre clair donné par quelqu\'un' },
            { key: 'together', emoji: '🤝', label: 'J\'aime décider en groupe' },
          ],
        },
        {
          key: 'pride',
          label: 'Ce qui me rend fier :',
          options: [
            { key: 'difficult_done', emoji: '🏆', label: 'Avoir bien réussi quelque chose de difficile' },
            { key: 'helped_someone', emoji: '🤝', label: 'Avoir aidé quelqu\'un' },
            { key: 'new_idea', emoji: '💡', label: 'Avoir eu une idée nouvelle' },
            { key: 'beautiful', emoji: '🎨', label: 'Avoir fait quelque chose de beau' },
            { key: 'fixed_built', emoji: '🔧', label: 'Avoir réparé ou construit quelque chose' },
            { key: 'recognized', emoji: '👏', label: 'Avoir été reconnu, applaudi' },
            { key: 'unseen_work', emoji: '🤫', label: 'Avoir fait un truc bien, même si personne ne le sait' },
          ],
        },
        {
          key: 'fatigue',
          label: 'Ce qui me fatigue le plus :',
          options: [
            { key: 'long_silence', emoji: '😶', label: 'Le silence trop long' },
            { key: 'noise', emoji: '🗣️', label: "Le bruit et l'agitation" },
            { key: 'tension', emoji: '😠', label: 'Les disputes, les tensions' },
            { key: 'strict_rules', emoji: '📏', label: 'Les règles trop strictes' },
            { key: 'unclear', emoji: '🤷', label: "Ne pas savoir ce qu'on attend de moi" },
            { key: 'repetition', emoji: '🥱', label: 'La répétition' },
          ],
        },
        {
          key: 'meaning',
          label: 'Pour que ce que je fais ait du sens :',
          options: [
            { key: 'serve_one', emoji: '👤', label: 'Ça sert à une personne en particulier' },
            { key: 'change_world', emoji: '🌍', label: 'Ça change un peu le monde, même à petite échelle' },
            { key: 'learn', emoji: '🎓', label: "Ça m'apprend quelque chose" },
            { key: 'live_well', emoji: '💰', label: 'Ça me permet de bien vivre plus tard' },
            { key: 'beautiful_self', emoji: '🎨', label: 'Ça est beau ou intéressant en soi' },
            { key: 'unknown', emoji: '🤔', label: 'Je ne sais pas encore' },
          ],
        },
      ],
    },
    {
      kind: 'magic-day',
      title: 'Projections',
      intro:
        "Trois petites questions pour te projeter — sans pression, juste pour toi.",
      fields: [
        {
          key: 'magic_week_what',
          label: 'La semaine magique : tu apprendrais quoi ?',
          multiline: true,
          placeholder: 'Une semaine entière à apprendre ce que tu veux, de qui tu veux.',
        },
        {
          key: 'magic_week_who',
          label: 'Avec qui ? (un prof, un pro, un proche, des vidéos…)',
        },
        {
          key: 'magic_week_where',
          label: 'Où ?',
        },
        {
          key: 'letter_future',
          label: 'Une lettre au toi de dans 10 ans',
          multiline: true,
          placeholder:
            'Pas le métier que tu feras. Juste : ce que tu espères qui soit vrai pour toi.',
        },
        {
          key: 'admires_1',
          label: 'Une personne qui t\'impressionne — qui et pourquoi',
          multiline: true,
          placeholder: 'Connue ou pas. Voisin, prof, youtubeur, personnage de livre…',
        },
        {
          key: 'admires_2',
          label: 'Une deuxième personne qui t\'impressionne',
          multiline: true,
        },
        {
          key: 'admires_3',
          label: 'Une troisième personne qui t\'impressionne',
          multiline: true,
        },
      ],
      allowPhoto: false,
      closingNote:
        "Si tu as déjà rempli un carnet l'année dernière, on le ressortira après — pour comparer, pas pour juger.",
    },
  ],
  adultClosing:
    "Ce carnet n'est pas une décision. C'est une photo de toi aujourd'hui. On le garde, on le ressortira l'année prochaine. Tu n'as rien à choisir maintenant.",
};
