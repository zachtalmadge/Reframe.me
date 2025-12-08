import { jsPDF } from "jspdf";
import { NarrativeItem, ResponseLetter } from "@/lib/resultsPersistence";

const narrativeTypeLabels: Record<string, string> = {
  full_disclosure: "Direct & Professional",
  skills_focused: "Skills-First Approach",
  growth_journey: "Growth-Focused",
  minimal_disclosure: "Brief & Confident",
  values_aligned: "Values-Aligned",
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 7;
const HEADING_SIZE = 16;
const BODY_SIZE = 11;

// Brand colors (RGB 0-255)
const TEAL = { r: 15, g: 118, b: 110 };        // #0F766E
const ORANGE = { r: 249, g: 115, b: 22 };      // #F97316
const TEXT_DARK = { r: 17, g: 24, b: 39 };     // dark neutral
const TEXT_MUTED = { r: 107, g: 114, b: 128 }; // muted gray

// Header text constants
const HEADER_BRAND = "Reframe.me";
const HEADER_CONGRATS = "Congratulations! Here are your documents from Reframe.me.";
const HEADER_GUIDANCE = "Take time to read through these, practice them out loud if it feels helpful, and edit them so they sound like your own voice.";
const HEADER_DISCLAIMER = "These materials don't guarantee any outcome or hiring decision and aren't legal advice. Consider sharing them with a trusted person or legal aid if you have questions.";

function setTextColor(doc: jsPDF, color: { r: number; g: number; b: number }) {
  doc.setTextColor(color.r, color.g, color.b);
}

function drawBrandedHeader(doc: jsPDF): number {
  let y = MARGIN;

  // Brand title in teal
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  setTextColor(doc, TEAL);
  doc.text(HEADER_BRAND, MARGIN, y);
  y += 10;

  // Congratulatory line in orange
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  setTextColor(doc, ORANGE);
  doc.text(HEADER_CONGRATS, MARGIN, y);
  y += 8;

  // Guidance line in neutral
  doc.setFontSize(10);
  setTextColor(doc, TEXT_DARK);
  const guidanceLines = doc.splitTextToSize(HEADER_GUIDANCE, CONTENT_WIDTH);
  for (const line of guidanceLines) {
    doc.text(line, MARGIN, y);
    y += 5;
  }
  y += 3;

  // Disclaimer in muted gray, smaller
  doc.setFontSize(9);
  setTextColor(doc, TEXT_MUTED);
  const disclaimerLines = doc.splitTextToSize(HEADER_DISCLAIMER, CONTENT_WIDTH);
  for (const line of disclaimerLines) {
    doc.text(line, MARGIN, y);
    y += 4.5;
  }

  // Divider line
  y += 5;
  doc.setDrawColor(TEAL.r, TEAL.g, TEAL.b);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 12;

  return y;
}

function drawSectionHeading(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(HEADING_SIZE + 2);
  doc.setFont("helvetica", "bold");
  setTextColor(doc, TEAL);
  doc.text(title, MARGIN, y);
  y += 3;

  // Underline
  doc.setDrawColor(TEAL.r, TEAL.g, TEAL.b);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + doc.getTextWidth(title), y);
  y += 10;

  return y;
}

function drawNarrativeTitle(doc: jsPDF, index: number, label: string, y: number): number {
  doc.setFontSize(HEADING_SIZE - 2);
  doc.setFont("helvetica", "bold");
  
  // Orange bullet
  setTextColor(doc, ORANGE);
  const bullet = "\u2022";
  doc.text(bullet, MARGIN, y);
  
  // Teal title text
  setTextColor(doc, TEAL);
  const titleText = ` ${index + 1}. ${label}`;
  doc.text(titleText, MARGIN + 4, y);
  y += LINE_HEIGHT + 1;

  return y;
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  let currentY = y;

  for (const line of lines) {
    if (currentY > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      currentY = MARGIN;
    }
    doc.text(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

export function buildSingleNarrativePdf(narrative: NarrativeItem): jsPDF {
  const doc = new jsPDF();
  const label =
    narrative.title || narrativeTypeLabels[narrative.type] || "Narrative";

  // Draw branded header
  let y = drawBrandedHeader(doc);

  // Draw narrative title with orange bullet and teal text
  y = drawNarrativeTitle(doc, 0, label, y);
  y += 3;

  // Body text in dark neutral
  doc.setFontSize(BODY_SIZE);
  doc.setFont("helvetica", "normal");
  setTextColor(doc, TEXT_DARK);
  addWrappedText(doc, narrative.content, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);

  return doc;
}

export function buildAllNarrativesPdf(narratives: NarrativeItem[]): jsPDF {
  const doc = new jsPDF();
  
  // Draw branded header
  let y = drawBrandedHeader(doc);

  // Draw section heading
  y = drawSectionHeading(doc, "Disclosure Narratives", y);

  narratives.forEach((narrative, index) => {
    const label =
      narrative.title ||
      narrativeTypeLabels[narrative.type] ||
      `Narrative ${index + 1}`;

    if (y > PAGE_HEIGHT - 60) {
      doc.addPage();
      y = MARGIN;
    }

    // Draw narrative title with orange bullet and teal text
    y = drawNarrativeTitle(doc, index, label, y);
    y += 3;

    // Body text in dark neutral
    doc.setFontSize(BODY_SIZE);
    doc.setFont("helvetica", "normal");
    setTextColor(doc, TEXT_DARK);
    y = addWrappedText(
      doc,
      narrative.content,
      MARGIN,
      y,
      CONTENT_WIDTH,
      LINE_HEIGHT
    );
    y += 15;
  });

  return doc;
}

export function buildLetterPdf(letter: ResponseLetter): jsPDF {
  const doc = new jsPDF();
  const title = letter.title || "Pre-Adverse Action Response Letter";

  // Draw branded header
  let y = drawBrandedHeader(doc);

  // Draw section heading in teal
  y = drawSectionHeading(doc, title, y);

  // Body text in dark neutral
  doc.setFontSize(BODY_SIZE);
  doc.setFont("helvetica", "normal");
  setTextColor(doc, TEXT_DARK);
  addWrappedText(doc, letter.content, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);

  return doc;
}

export function buildAllDocumentsPdf(
  narratives: NarrativeItem[],
  letter: ResponseLetter | null
): jsPDF {
  const doc = new jsPDF();
  
  // Draw branded header
  let y = drawBrandedHeader(doc);

  // Narratives section
  if (narratives.length > 0) {
    // Draw section heading
    y = drawSectionHeading(doc, "Disclosure Narratives", y);

    narratives.forEach((narrative, index) => {
      const label =
        narrative.title ||
        narrativeTypeLabels[narrative.type] ||
        `Narrative ${index + 1}`;

      if (y > PAGE_HEIGHT - 60) {
        doc.addPage();
        y = MARGIN;
      }

      // Draw narrative title with orange bullet and teal text
      y = drawNarrativeTitle(doc, index, label, y);
      y += 3;

      // Body text in dark neutral
      doc.setFontSize(BODY_SIZE);
      doc.setFont("helvetica", "normal");
      setTextColor(doc, TEXT_DARK);
      y = addWrappedText(
        doc,
        narrative.content,
        MARGIN,
        y,
        CONTENT_WIDTH,
        LINE_HEIGHT
      );
      y += 15;
    });
  }

  // Letter section
  if (letter) {
    // Add page break before letter if there are narratives
    if (narratives.length > 0) {
      doc.addPage();
      y = MARGIN;
    }

    const title = letter.title || "Pre-Adverse Action Response Letter";

    // Draw section heading in teal
    y = drawSectionHeading(doc, title, y);

    // Body text in dark neutral
    doc.setFontSize(BODY_SIZE);
    doc.setFont("helvetica", "normal");
    setTextColor(doc, TEXT_DARK);
    addWrappedText(doc, letter.content, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);
  }

  return doc;
}

export function downloadPdf(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
