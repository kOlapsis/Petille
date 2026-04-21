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
  document.documentElement.classList.add('flyer-root', 'flyer-a6');
  await document.fonts.ready.catch(() => undefined);
  ready.value = true;
  (window as unknown as { __flyerReady?: boolean }).__flyerReady = true;
});
</script>

<template>
  <div class="flyer" :data-ready="ready ? '1' : '0'">
    <article class="flyer-page flyer-a6-page" aria-label="Flyer Pétille — A6">
      <header class="head">
        <p class="eyebrow">Pour les 6-11 ans · Sans compte · Sans tracking</p>
        <h1 class="brand">
          <span aria-hidden="true" class="brand-sparkle">✨</span>
          <span>Pétille</span>
        </h1>
        <p class="tagline">Ce qui <em>fait briller</em> votre enfant.</p>
      </header>

      <p class="lede">
        Un carnet d'appétences à remplir une fois par an, pour aider votre enfant à mieux
        se connaître — <strong>sans jamais lui souffler de métier</strong>.
      </p>

      <ul class="promises">
        <li>Aucun compte, aucune donnée ne sort de votre appareil.</li>
        <li>Gratuit, libre (AGPL v3), sans pub ni traceur.</li>
        <li>Aucun métier n'est jamais suggéré à votre enfant.</li>
      </ul>

      <section class="cta">
        <div class="cta-text">
          <p class="cta-kicker">Essayer</p>
          <p class="cta-url">petille.kolapsis.com</p>
        </div>
        <div class="cta-qr">
          <img
            v-if="qrDataUrl"
            :src="qrDataUrl"
            alt="QR code vers petille.kolapsis.com"
            width="256"
            height="256"
          />
        </div>
      </section>

      <footer class="foot">Projet bénévole · github.com/kOlapsis/Petille</footer>
    </article>
  </div>
</template>

<style>
@import '@fontsource/atkinson-hyperlegible/latin-400.css';
@import '@fontsource/atkinson-hyperlegible/latin-700.css';
@import '@fontsource/atkinson-hyperlegible/latin-400-italic.css';

html.flyer-root,
html.flyer-root body {
  margin: 0;
  padding: 0;
  background: #e5e7eb;
  color: #0f172a;
  font-family: 'Atkinson Hyperlegible', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 0 !important;
}
html.flyer-root body > #app > a.skip-link,
html.flyer-root body > #app > div > header,
html.flyer-root body > #app > div > footer {
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
  size: A6;
  margin: 0;
}

.flyer {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.flyer-a6-page {
  position: relative;
  width: 105mm;
  height: 148mm;
  padding: 7mm 7mm 5mm;
  box-sizing: border-box;
  overflow: hidden;
  background: #fffaf4;
  color: #0f172a;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
  box-shadow: 0 6px 30px -14px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 3mm;
}

.head {
  text-align: center;
}
.eyebrow {
  margin: 0;
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c2410c;
}
.brand {
  margin: 2mm 0 1mm;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 20pt;
  font-weight: 700;
  line-height: 1;
}
.brand-sparkle { font-size: 16pt; line-height: 1; }
.tagline {
  margin: 0;
  font-size: 11.5pt;
  font-weight: 700;
  line-height: 1.15;
}
.tagline em {
  font-style: normal;
  color: #c2410c;
  text-decoration: underline;
  text-decoration-color: #fdba74;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}

.lede {
  margin: 1mm 0 0;
  text-align: center;
  font-size: 8.5pt;
  line-height: 1.35;
  color: #1f2937;
}

.promises {
  list-style: none;
  margin: 1mm 0 0;
  padding: 3mm 3.5mm;
  background: #fff3e6;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 1.5mm;
}
.promises li {
  position: relative;
  padding-left: 5mm;
  font-size: 8pt;
  line-height: 1.3;
  color: #1f2937;
}
.promises li::before {
  content: '';
  position: absolute;
  left: 0.5mm;
  top: 1mm;
  width: 2.8mm;
  height: 2.8mm;
  border-radius: 50%;
  background: #ea580c;
}
.promises li::after {
  content: '';
  position: absolute;
  left: 1.1mm;
  top: 1.9mm;
  width: 1.6mm;
  height: 0.8mm;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  transform: rotate(-45deg);
}

.cta {
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4mm;
  align-items: center;
  padding: 3mm 3.5mm;
  background: #fff;
  border: 1px solid #ffedd5;
  border-radius: 10px;
  box-shadow: 0 3px 10px -8px rgba(194, 65, 12, 0.4);
}
.cta-kicker {
  margin: 0;
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c2410c;
}
.cta-url {
  margin: 0.5mm 0 0;
  font-size: 11pt;
  font-weight: 700;
  color: #0f172a;
  word-break: break-all;
}
.cta-qr {
  width: 22mm;
  height: 22mm;
  padding: 1.5mm;
  background: #fff;
  border: 1.2px solid #fdba74;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cta-qr img {
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
}

.foot {
  margin-top: 2mm;
  padding-top: 1.5mm;
  border-top: 1px solid #ffedd5;
  text-align: center;
  font-size: 6.5pt;
  color: #1f2937;
}

@media print {
  html.flyer-root,
  html.flyer-root body {
    background: #fff !important;
  }
  .flyer { padding: 0; }
  .flyer-a6-page { box-shadow: none; }
}
</style>
