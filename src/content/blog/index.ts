/**
 * Articles du journal Pétille. Chaque article est un module TS pour garder
 * les builds SSG déterministes et éviter de rendre du Markdown au runtime.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  tags: string[];
  author: string;
  /** Corps HTML statique, rédigé à la main (HTML minimal sandboxé au build). */
  html: string;
}

const POSTS: BlogPost[] = [
  {
    slug: 'tous-veterinaire-ou-pompier',
    title:
      'Pourquoi tous les enfants de 6 ans veulent être vétérinaires ou pompiers',
    description:
      "Ce n'est pas une fatalité : à 6 ans, les enfants ne choisissent pas un métier, ils nomment ce qu'ils connaissent. Pourquoi c'est normal, et ce qu'on peut faire.",
    date: '2026-04-01',
    tags: ['orientation', 'développement', '6-11 ans'],
    author: 'Benjamin',
    html: `
<p>Si vous demandez à une classe de CP ce qu'ils veulent faire plus tard, vous obtenez
un nuage très concentré : vétérinaire, pompier, maîtresse, footballeur, policier, vendeuse
de bonbons. Ça semble mignon. C'est surtout <strong>mathématique</strong>.</p>

<h2>On ne peut pas vouloir ce qu'on ne connaît pas</h2>
<p>Les enfants de 6 à 8 ans ne choisissent pas un métier : ils nomment ceux qui ont un
visage dans leur monde. Le ou la vétérinaire est la personne qui a soigné le chien.
Le ou la pompier·ère a une grosse voiture rouge qui fait du bruit. La maîtresse est la
personne avec qui on passe 6 heures par jour. L'univers « métiers » que l'enfant
peut citer est celui qu'il <em>rencontre</em>.</p>

<h2>La théorie de Gottfredson en un paragraphe</h2>
<p>Linda Gottfredson, chercheuse en psychologie du développement, a décrit dans les
années 1980 comment les enfants construisent leur « carte cognitive des métiers » :</p>
<ul>
  <li><strong>3-5 ans</strong> : orientation par la taille et le pouvoir (« les grands »).</li>
  <li><strong>6-8 ans</strong> : orientation par le genre. Les filles éliminent les métiers
  « de garçons » et inversement, en s'appuyant sur les images reçues.</li>
  <li><strong>9-13 ans</strong> : orientation par le statut social perçu.</li>
  <li><strong>14 ans et +</strong> : orientation par les goûts personnels, la compatibilité.</li>
</ul>
<p>Autrement dit : ce qui se joue entre 6 et 11 ans, ce n'est pas un choix de métier,
c'est <strong>l'élagage silencieux</strong> du champ des possibles. Un enfant qui, à 8 ans,
a décidé que « c'est pas pour moi », il est ensuite très difficile de le faire revenir.</p>

<h2>Ce qu'on peut faire (et ce qu'on ne devrait pas faire)</h2>
<p><strong>Ce qu'on ne devrait pas faire</strong> : forcer un·e enfant à choisir. Lui servir
un test d'orientation. Lui suggérer un métier parce qu'on a repéré une « appétence ».
Célébrer une réponse (« ah super, tu seras médecin alors ! ») plus qu'une autre.</p>
<p><strong>Ce qu'on peut faire</strong> : observer, nommer, garder la trace.
« Tu aimes démonter les choses pour comprendre comment ça marche » est une observation.
« Tu seras ingénieur·e » est un verdict. Les enfants ont besoin du premier, pas du second.</p>

<p>C'est toute la raison d'être de ce carnet.</p>
`,
  },
  {
    slug: 'stereotypes-genre-metiers',
    title:
      'Les stéréotypes de genre dans les métiers se fixent entre 6 et 10 ans',
    description:
      "Études sur le 'draw a scientist test' et données récentes : comment les enfants apprennent qui a le droit de faire quoi. Et comment on peut laisser la fenêtre ouverte plus longtemps.",
    date: '2026-04-08',
    tags: ['stéréotypes', 'genre', 'recherche'],
    author: 'Benjamin',
    html: `
<p>En 1983, la chercheuse américaine David Wade Chambers publie une étude qui deviendra
célèbre : le <em>Draw-A-Scientist Test</em>. Il demande à près de 5 000 enfants de dessiner
un·e scientifique. Résultat : 99,4 % des dessins représentent un homme. Moins de 30 filles,
sur 5 000, osent dessiner une femme.</p>

<h2>40 ans plus tard, c'est mieux — mais pas tant que ça</h2>
<p>En 2018, une méta-analyse de l'étude (David Miller, Northwestern University) portant sur
78 études entre 1966 et 2016 montre que les choses ont bougé :</p>
<ul>
  <li>Dans les années 60, 0,6 % des enfants dessinaient une femme scientifique.</li>
  <li>Aujourd'hui, environ 28 % le font.</li>
  <li>Mais le basculement vers le stéréotype « scientifique = homme » se fait toujours
  entre 6 et 10 ans, avec une accélération nette autour de 7-8 ans.</li>
</ul>

<h2>Ce n'est pas qu'une question de représentation</h2>
<p>Les études en sciences de l'éducation convergent : à partir de 6-7 ans, les enfants
intègrent une grille implicite de ce qui « se fait » et « ne se fait pas » pour leur genre.
Cette grille s'auto-renforce : moins un·e enfant se projette dans un métier, moins il ou elle
va explorer ce métier, et moins il ou elle collectera de contre-exemples.</p>
<p>Ce n'est pas une prison définitive — des adultes en changent tous les jours. Mais
chaque année passée avec une fenêtre fermée est une année qu'il faudra rouvrir plus tard.</p>

<h2>Ce qui marche (un peu) pour retarder la fermeture</h2>
<ul>
  <li><strong>Exposer à des contre-exemples précoces</strong> : femmes pilotes, hommes
  infirmiers, sans en faire un discours militant — juste en les nommant quand on les rencontre.</li>
  <li><strong>Ne pas genrer les jeux</strong>, surtout entre 3 et 6 ans (phase de
  construction identitaire).</li>
  <li><strong>Parler métier par activité, pas par catégorie</strong> : « les gens qui
  soignent les animaux » plutôt que « les vétérinaires ». Ça garde l'éventail ouvert.</li>
  <li><strong>Observer ce qui reste stable chez son enfant dans le temps</strong>, sans
  projeter. Un carnet d'appétences relu d'année en année est un outil simple pour ça.</li>
</ul>

<h2>Sources</h2>
<ul>
  <li>Chambers, D. W. (1983). Stereotypic images of the scientist: The Draw-a-Scientist Test.
  <em>Science Education, 67(2), 255-265.</em></li>
  <li>Miller, D. I., Nolla, K. M., Eagly, A. H., &amp; Uttal, D. H. (2018). The development of
  children's gender-science stereotypes: A meta-analysis of 5 decades of U.S. Draw-a-Scientist studies.
  <em>Child Development, 89(6), 1943-1955.</em></li>
  <li>Gottfredson, L. S. (1981). Circumscription and compromise: A developmental theory of
  occupational aspirations. <em>Journal of Counseling Psychology, 28(6), 545-579.</em></li>
</ul>
`,
  },
  {
    slug: 'outil-sans-aucune-suggestion-metier',
    title:
      "Pourquoi j'ai construit un outil d'orientation sans aucune suggestion de métier",
    description:
      'Le positionnement radical de Pétille : ne jamais mapper une réponse vers un métier. Pourquoi c\'est un choix philosophique, pas une limitation technique.',
    date: '2026-04-15',
    tags: ['positionnement', 'vision', 'foss'],
    author: 'Benjamin',
    html: `
<p>Quand on montre la maquette de Pétille à quelqu'un qui connaît le secteur, la première
réaction est presque toujours la même : « OK, et le résultat ? Ça te sort une liste de
métiers recommandés, non ? »</p>
<p>Non. Jamais. C'est le cœur du projet.</p>

<h2>Le biais du « si on a la donnée, faisons-en quelque chose »</h2>
<p>Techniquement, rien n'empêche d'entraîner un modèle de recommandation sur les réponses.
Les appétences collectées (thèmes, façons de faire, contexte) pourraient très bien alimenter
un mapping vers des familles de métiers. Ce serait même « utile », au sens où on dit d'un
service qu'il est utile : il produit un résultat actionnable.</p>
<p>Sauf que le résultat, à 7 ans, ce serait une étiquette collée sur un enfant. Et cette
étiquette, on l'a vu dans les articles précédents (
<a href="/blog/stereotypes-genre-metiers">1</a>,
<a href="/blog/tous-veterinaire-ou-pompier">2</a>), arrive précisément au moment où la carte
cognitive des métiers se referme. L'enfant ne retient pas « j'aime les animaux, la construction
et travailler seul·e » — il retient « l'app dit que je serai vétérinaire ».</p>

<h2>Ce qu'on perd quand on retire le mapping</h2>
<ul>
  <li>On perd la satisfaction immédiate d'avoir « un résultat ».</li>
  <li>On perd l'argument marketing « découvrez le métier qui vous correspond ».</li>
  <li>On perd le rétentif utilisateur (pas de raison de revenir si le verdict est rendu).</li>
</ul>

<h2>Ce qu'on gagne</h2>
<ul>
  <li>On garde la fenêtre des possibles ouverte plus longtemps.</li>
  <li>On produit un outil qui survit à l'usage — on peut y revenir dans 12 mois sans que
  la conclusion soit « périmée ».</li>
  <li>On évite de reproduire, avec une couche de techno, les biais qu'on voulait combattre
  (un modèle entraîné sur les données d'orientation existantes reproduira les stéréotypes
  qu'il a ingurgités).</li>
  <li>On permet une conversation famille-enfant — parce qu'il n'y a pas de « réponse »
  donnée par la machine à laquelle se soumettre.</li>
</ul>

<h2>Le carnet comme forme, pas comme application</h2>
<p>Pétille est pensé comme un <strong>carnet</strong>, pas comme un test. La différence
est importante :</p>
<ul>
  <li>Un test se remplit une fois et rend un verdict. L'interaction est finie.</li>
  <li>Un carnet se remplit régulièrement et garde la trace. L'interaction est un dialogue
  avec soi-même dans le temps.</li>
</ul>
<p>Un enfant qui, pendant trois années de suite, coche systématiquement « aimer les animaux »
et « comprendre comment ça marche » n'a pas besoin qu'une machine le lui dise. Il a besoin
qu'on l'<em>observe</em> et qu'on lui <em>renvoie</em> ces constantes. Le carnet fait ça,
rien de plus.</p>

<h2>Et si l'enfant demande « alors je ferai quoi ? »</h2>
<p>Il y a une réponse honnête à cette question, et elle ne contient pas de métier.
Elle contient : « tu aimes ces univers, tu travailles plutôt comme ça, tu es bien dans
ce contexte-là. Plein de métiers différents vont avec tout ça. On regardera dans quelques
années quels métiers existent et lesquels te donnent envie, mais tu n'as pas à choisir
maintenant. »</p>
<p>C'est cette phrase, exactement, que Pétille vise à rendre possible.</p>
`,
  },
];

export const blogPosts: BlogPost[] = [...POSTS].sort((a, b) =>
  b.date.localeCompare(a.date)
);

export function findPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
