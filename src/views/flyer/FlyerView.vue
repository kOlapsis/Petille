<script setup lang="ts">
import { onMounted, ref } from 'vue';
import QRCode from 'qrcode';

const FLYER_URL = 'https://petille.kolapsis.com';
const qrDataUrl = ref('');
const ready = ref(false);

onMounted(async () => {
  qrDataUrl.value = await QRCode.toDataURL(FLYER_URL, {
    errorCorrectionLevel: 'Q',
    margin: 0,
    scale: 10,
    color: { dark: '#0f172a', light: '#ffffff' },
  });
  document.documentElement.classList.add('flyer-root');
  await document.fonts.ready.catch(() => undefined);
  ready.value = true;
  (window as unknown as { __flyerReady?: boolean }).__flyerReady = true;
});
</script>

<template>
  <div class="flyer" :data-ready="ready ? '1' : '0'">
    <!-- ============================== RECTO ============================== -->
    <article class="flyer-page flyer-recto" aria-label="Flyer Pétille — recto">
      <header class="recto-head">
        <p class="eyebrow">Pour les 6 à 11 ans · Sans compte · Sans tracking</p>
        <h1 class="brand">
          <span aria-hidden="true" class="brand-sparkle">✨</span>
          <span class="brand-name">Pétille</span>
        </h1>
        <p class="tagline">
          Ce qui <em>fait briller</em> votre enfant.
        </p>
        <p class="lede">
          Un petit carnet pour aider votre enfant à mieux connaître ce qui l'attire —
          sans jamais lui souffler de métier à faire plus tard.
        </p>
      </header>

      <section class="how">
        <h2 class="section-title">Comment ça se passe&nbsp;?</h2>
        <ol class="steps">
          <li class="step">
            <span class="step-icon" aria-hidden="true">🌱</span>
            <div>
              <h3>Une fois par an</h3>
              <p>
                Votre enfant répond à quelques questions adaptées à son âge (6-8 ou 9-11 ans).
                20 à 30 minutes, confortablement installé.
              </p>
            </div>
          </li>
          <li class="step">
            <span class="step-icon" aria-hidden="true">📓</span>
            <div>
              <h3>Un portrait à cet instant</h3>
              <p>
                Pas de métier suggéré. Juste un profil d'appétences&nbsp;: ce qu'il aime faire,
                les univers qui l'attirent, les contextes où il se sent bien.
              </p>
            </div>
          </li>
          <li class="step">
            <span class="step-icon" aria-hidden="true">🪞</span>
            <div>
              <h3>On compare l'année suivante</h3>
              <p>
                Ce qui revient d'une année sur l'autre dessine quelque chose de stable.
                Ce qui change est normal&nbsp;: les enfants grandissent.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <aside class="pledge">
        <p>
          Aucun métier n'est jamais suggéré à votre enfant. L'outil s'arrête au portrait.
          Le reste, c'est à vous et à votre enfant d'en parler, à votre rythme.
        </p>
      </aside>

      <footer class="recto-foot">
        <span class="foot-url">petille.kolapsis.com</span>
        <span class="foot-sep" aria-hidden="true">·</span>
        <span class="foot-tag">FOSS · AGPL v3</span>
      </footer>
    </article>

    <!-- ============================== VERSO ============================== -->
    <article class="flyer-page flyer-verso" aria-label="Flyer Pétille — verso">
      <section class="guarantees">
        <h2 class="section-title">Ce que Pétille garantit</h2>
        <ul class="checks">
          <li>Aucun compte, aucun email, aucune inscription.</li>
          <li>Aucune donnée ne sort de votre appareil.</li>
          <li>Rien n'est envoyé sur internet, rien n'est stocké sur nos serveurs.</li>
          <li>Gratuit, libre (AGPL v3), open source.</li>
          <li>Aucune publicité, aucun traceur, aucun partenariat commercial.</li>
        </ul>
      </section>

      <section class="heads-up">
        <h2 class="section-title-sm">
          <span aria-hidden="true">⚠️</span> À savoir avant de commencer
        </h2>
        <p>
          Comme rien n'est stocké côté serveur, <strong>c'est à vous d'archiver vos
          exports</strong> après chaque session. Lisez la FAQ sur le site avant de vous
          lancer&nbsp;: elle explique comment faire proprement. Sans cette étape, vous
          perdriez l'historique.
        </p>
      </section>

      <section class="after">
        <h2 class="section-title-sm">Et après&nbsp;?</h2>
        <p>
          Vers 12 ans, votre enfant découvrira les outils officiels d'orientation au collège
          (Avenir(s), Onisep). Avec Pétille, il n'arrivera pas devant ces outils en partant
          de zéro — il aura plusieurs années de réponses archivées, une vraie connaissance
          de lui-même à faire grandir.
        </p>
      </section>

      <section class="cta">
        <div class="cta-text">
          <p class="cta-kicker">Pour essayer</p>
          <p class="cta-url">petille.kolapsis.com</p>
          <p class="cta-hint">Scannez le code, ou tapez l'adresse dans votre navigateur.</p>
        </div>
        <div class="cta-qr">
          <div class="qr-frame">
            <img
              v-if="qrDataUrl"
              :src="qrDataUrl"
              alt="QR code vers petille.kolapsis.com"
              width="256"
              height="256"
            />
          </div>
        </div>
      </section>

      <footer class="verso-foot">
        <p>
          Pétille est un projet bénévole. Code source public&nbsp;:
          <span class="mono">github.com/kOlapsis/Petille</span>
        </p>
      </footer>
    </article>
  </div>
</template>

<style>
/* Fonts embarquées (locales, aucun runtime externe) — licence SIL OFL */
@import '@fontsource/atkinson-hyperlegible/latin-400.css';
@import '@fontsource/atkinson-hyperlegible/latin-700.css';
@import '@fontsource/atkinson-hyperlegible/latin-400-italic.css';

/* Isolation : ces règles ne s'appliquent que quand on est sur /flyer. */
html.flyer-root,
html.flyer-root body {
  margin: 0;
  padding: 0;
  background: #e5e7eb; /* neutre autour des pages en preview */
  color: #0f172a;
  font-family: 'Atkinson Hyperlegible', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 0 !important;
}
/* Neutralise le chrome global du site pour cette page uniquement. */
html.flyer-root body > #app > a.skip-link,
html.flyer-root body > #app > div > header,
html.flyer-root body > #app > div > footer,
html.flyer-root body > #app > div > .install-prompt {
  display: none !important;
}
html.flyer-root body > #app > div {
  min-height: 0 !important;
  display: block !important;
}
html.flyer-root #main {
  flex: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

@page {
  size: A5;
  margin: 0;
}

.flyer {
  --ink: #0f172a;
  --ink-soft: #1f2937;
  --brand-700: #c2410c;
  --brand-600: #ea580c;
  --brand-500: #f97316;
  --brand-300: #fdba74;
  --brand-100: #ffedd5;
  --brand-50:  #fff7ed;
  --cream-50: #fffaf4;
  --cream-100: #fff3e6;
  --radius: 12px; /* équivalent rounded-petal en print */
  --shadow: 0 4px 14px -10px rgba(194, 65, 12, 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px 16px;
}

.flyer-page {
  position: relative;
  width: 148mm;
  height: 210mm;
  padding: 10mm 10mm 8mm; /* marges > 5mm requises */
  box-sizing: border-box;
  overflow: hidden;
  background: var(--cream-50);
  color: var(--ink);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
  box-shadow: 0 6px 30px -14px rgba(0, 0, 0, 0.2);
  break-after: page;
  page-break-after: always;
}

.flyer-page:last-child {
  break-after: auto;
  page-break-after: auto;
}

/* ================== RECTO ================== */

.recto-head {
  text-align: center;
}

.eyebrow {
  margin: 0;
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-700);
}

.brand {
  margin: 3mm 0 2mm;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 28pt;
  font-weight: 700;
  line-height: 1;
  color: var(--ink);
}
.brand-sparkle {
  font-size: 24pt;
  line-height: 1;
}
.brand-name {
  letter-spacing: -0.01em;
}

.tagline {
  margin: 2mm 0 3mm;
  font-size: 17pt;
  font-weight: 700;
  line-height: 1.15;
  color: var(--ink);
}
.tagline em {
  font-style: normal;
  color: var(--brand-700);
  text-decoration: underline;
  text-decoration-color: var(--brand-300);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.lede {
  margin: 0 auto;
  max-width: 110mm;
  font-size: 10pt;
  line-height: 1.45;
  color: var(--ink-soft);
}

.section-title {
  margin: 0 0 3mm;
  font-size: 12pt;
  font-weight: 700;
  color: var(--ink);
}
.section-title-sm {
  margin: 0 0 2mm;
  font-size: 10.5pt;
  font-weight: 700;
  color: var(--ink);
}

.how {
  margin-top: 6mm;
}
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 3mm;
}
.step {
  display: grid;
  grid-template-columns: 12mm 1fr;
  gap: 4mm;
  align-items: start;
  padding: 3.5mm 4mm;
  background: #ffffff;
  border: 1px solid var(--brand-100);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.step-icon {
  font-size: 18pt;
  line-height: 1;
  text-align: center;
  padding-top: 1mm;
}
.step h3 {
  margin: 0 0 1mm;
  font-size: 10.5pt;
  font-weight: 700;
  color: var(--ink);
}
.step p {
  margin: 0;
  font-size: 9pt;
  line-height: 1.4;
  color: var(--ink-soft);
}

.pledge {
  margin-top: 5mm;
  padding: 4mm 5mm;
  background: var(--cream-100);
  border-left: 3px solid var(--brand-600);
  border-radius: 8px;
}
.pledge p {
  margin: 0;
  font-size: 9.5pt;
  font-style: italic;
  line-height: 1.4;
  color: var(--ink-soft);
}

.recto-foot {
  position: absolute;
  left: 10mm;
  right: 10mm;
  bottom: 5mm;
  display: flex;
  justify-content: center;
  gap: 6px;
  font-size: 8pt;
  color: var(--ink-soft);
  border-top: 1px solid var(--brand-100);
  padding-top: 2mm;
}
.foot-url { font-weight: 700; color: var(--brand-700); }
.foot-sep { color: var(--brand-300); }

/* ================== VERSO ================== */

.guarantees {
  margin-top: 2mm;
}
.checks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.8mm;
}
.checks li {
  position: relative;
  padding: 2mm 3mm 2mm 9mm;
  background: #ffffff;
  border: 1px solid var(--brand-100);
  border-radius: 8px;
  font-size: 9.5pt;
  line-height: 1.35;
  color: var(--ink-soft);
}
.checks li::before {
  content: '';
  position: absolute;
  left: 3mm;
  top: 50%;
  width: 4mm;
  height: 4mm;
  transform: translateY(-50%);
  border-radius: 50%;
  background: var(--brand-600);
}
.checks li::after {
  content: '';
  position: absolute;
  left: 3.9mm;
  top: 50%;
  width: 2.2mm;
  height: 1.2mm;
  transform: translateY(-65%) rotate(-45deg);
  border-left: 1.2px solid #ffffff;
  border-bottom: 1.2px solid #ffffff;
}

.heads-up {
  margin-top: 5mm;
  padding: 3.5mm 4mm;
  border: 1px dashed var(--brand-600);
  border-radius: 8px;
  background: var(--brand-50);
}
.heads-up p {
  margin: 0;
  font-size: 9pt;
  line-height: 1.4;
  color: var(--ink-soft);
}

.after {
  margin-top: 5mm;
}
.after p {
  margin: 0;
  font-size: 9.5pt;
  line-height: 1.45;
  color: var(--ink-soft);
}

.cta {
  position: absolute;
  left: 10mm;
  right: 10mm;
  bottom: 12mm;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6mm;
  align-items: center;
  padding: 4mm 5mm;
  background: #ffffff;
  border: 1px solid var(--brand-100);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.cta-kicker {
  margin: 0;
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-700);
}
.cta-url {
  margin: 1mm 0 1mm;
  font-size: 14pt;
  font-weight: 700;
  color: var(--ink);
  word-break: break-all;
}
.cta-hint {
  margin: 0;
  font-size: 8pt;
  color: var(--ink-soft);
}
.cta-qr .qr-frame {
  width: 26mm;
  height: 26mm;
  padding: 2mm;
  background: #ffffff;
  border: 1.5px solid var(--brand-300);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cta-qr .qr-frame img {
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
}

.verso-foot {
  position: absolute;
  left: 10mm;
  right: 10mm;
  bottom: 4mm;
  text-align: center;
  font-size: 7.5pt;
  color: var(--ink-soft);
  border-top: 1px solid var(--brand-100);
  padding-top: 1.5mm;
}
.verso-foot p { margin: 0; }
.mono {
  font-family: ui-monospace, 'SF Mono', 'Menlo', 'Consolas', monospace;
}

/* Préparation impression : aucune marge écran, pages A5 sans ombre */
@media print {
  html.flyer-root,
  html.flyer-root body,
  html.flyer-root #app,
  html.flyer-root main {
    background: #ffffff !important;
  }
  .flyer {
    padding: 0;
    gap: 0;
  }
  .flyer-page {
    box-shadow: none;
  }
}
</style>
