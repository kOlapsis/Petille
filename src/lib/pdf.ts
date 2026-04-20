/**
 * Génération d'un PDF souvenir à partir d'une session.
 * Import dynamique de jsPDF pour ne pas peser sur le bundle initial.
 */
import type { Child, Session } from './schema';
import { actionLabel, contextOptionLabel, magicDayFieldLabel, themeLabel } from './labels';
import { displayThemes } from './profile';

const MARGIN = 15;
const LINE_HEIGHT = 7;

/**
 * jsPDF + Helvetica ne savent pas rendre les emojis (plan astral Unicode) ni
 * certains symboles rares : on obtient alors des « Ø=Ü6 ». On nettoie donc
 * avant toute écriture pour garder un PDF propre.
 */
function sanitizeForPdf(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

interface PdfContext {
  doc: import('jspdf').jsPDF;
  y: number;
  pageHeight: number;
  pageWidth: number;
}

function newPage(ctx: PdfContext): void {
  ctx.doc.addPage();
  ctx.y = MARGIN;
}

function ensureSpace(ctx: PdfContext, needed: number): void {
  if (ctx.y + needed > ctx.pageHeight - MARGIN) newPage(ctx);
}

function writeWrapped(ctx: PdfContext, text: string, options: {
  size?: number;
  bold?: boolean;
  color?: [number, number, number];
  spacingAfter?: number;
} = {}): void {
  const { size = 11, bold = false, color = [30, 30, 30], spacingAfter = 2 } = options;
  ctx.doc.setFont('helvetica', bold ? 'bold' : 'normal');
  ctx.doc.setFontSize(size);
  ctx.doc.setTextColor(color[0], color[1], color[2]);
  const maxWidth = ctx.pageWidth - MARGIN * 2;
  const lines = ctx.doc.splitTextToSize(sanitizeForPdf(text), maxWidth) as string[];
  for (const line of lines) {
    ensureSpace(ctx, LINE_HEIGHT);
    ctx.doc.text(line, MARGIN, ctx.y);
    ctx.y += (size * 0.4) + 2;
  }
  ctx.y += spacingAfter;
}

function heading(ctx: PdfContext, text: string): void {
  ensureSpace(ctx, 12);
  writeWrapped(ctx, text, { size: 14, bold: true, color: [198, 90, 30], spacingAfter: 3 });
}

function renderCover(ctx: PdfContext, child: Child, session: Session): void {
  const date = session.date.slice(0, 10);
  ctx.y = ctx.pageHeight / 3;
  writeWrapped(ctx, 'Pétille', { size: 32, bold: true, color: [198, 90, 30], spacingAfter: 6 });
  writeWrapped(ctx, `Ce qui fait pétiller ${child.first_name} aujourd'hui`, {
    size: 18,
    bold: false,
    spacingAfter: 8,
  });
  writeWrapped(ctx, `Passage du ${date} — ${session.age_at_session} ans`, { size: 12 });
  ctx.y += 12;
  writeWrapped(
    ctx,
    "Un portrait à un instant T. Pas de métier, pas de conclusion. " +
      "Juste ce que tu aimes, en ce moment.",
    { size: 11, color: [90, 90, 90] }
  );
}

function renderThemes(ctx: PdfContext, session: Session): void {
  const themes = displayThemes(session.answers.themes, session.questionnaire_version);
  if (themes.length === 0) return;
  heading(ctx, 'Tes univers du moment');
  for (const key of themes) {
    const { label } = themeLabel(session.questionnaire_version, key);
    writeWrapped(ctx, `• ${label}`);
  }
  ctx.y += 4;
}

function renderActions(ctx: PdfContext, session: Session): void {
  if (session.profile_summary.top_actions.length === 0) return;
  heading(ctx, 'Tes façons de faire');
  for (const key of session.profile_summary.top_actions) {
    const { label } = actionLabel(session.questionnaire_version, key);
    writeWrapped(ctx, `• ${label}`);
  }
  ctx.y += 4;
}

function renderContext(ctx: PdfContext, session: Session): void {
  const entries = Object.entries(session.answers.context);
  if (!entries.length) return;
  heading(ctx, 'Tu es bien quand…');
  for (const [qKey, optKey] of entries) {
    const { label } = contextOptionLabel(session.questionnaire_version, qKey, optKey);
    writeWrapped(ctx, `• ${label}`);
  }
  ctx.y += 4;
}

function renderMagicDay(ctx: PdfContext, session: Session): void {
  const { text, photo_data_url, extras } = session.answers.magic_day;
  if (!text && !photo_data_url && !extras) return;
  heading(ctx, 'Ta journée magique');
  if (text) writeWrapped(ctx, text);
  if (extras) {
    for (const [key, value] of Object.entries(extras)) {
      if (!value || !value.trim()) continue;
      const { label } = magicDayFieldLabel(session.questionnaire_version, key);
      writeWrapped(ctx, label, { size: 11, bold: true, spacingAfter: 0 });
      writeWrapped(ctx, value, { size: 10, color: [60, 60, 60] });
    }
  }
  if (photo_data_url) {
    ensureSpace(ctx, 60);
    try {
      const maxWidth = ctx.pageWidth - MARGIN * 2;
      const maxHeight = Math.min(90, ctx.pageHeight - ctx.y - MARGIN);
      ctx.doc.addImage(photo_data_url, 'JPEG', MARGIN, ctx.y, maxWidth, maxHeight, undefined, 'FAST');
      ctx.y += maxHeight + 4;
    } catch {
      writeWrapped(ctx, '[photo non rendue]', { size: 9, color: [150, 150, 150] });
    }
  }
}

export async function buildSessionPdf(child: Child, session: Session): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const ctx: PdfContext = {
    doc,
    y: MARGIN,
    pageHeight: doc.internal.pageSize.getHeight(),
    pageWidth: doc.internal.pageSize.getWidth(),
  };

  renderCover(ctx, child, session);
  newPage(ctx);
  renderThemes(ctx, session);
  renderActions(ctx, session);
  renderContext(ctx, session);
  renderMagicDay(ctx, session);

  return doc.output('blob');
}

export function pdfFilename(child: Child, session: Session): string {
  const slug = child.first_name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `petille-${slug || child.id.slice(0, 8)}-${session.date.slice(0, 10)}.pdf`;
}
