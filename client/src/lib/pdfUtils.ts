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

  doc.setFontSize(HEADING_SIZE);
  doc.setFont("helvetica", "bold");
  let y = MARGIN;
  y = addWrappedText(doc, label, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT + 2);

  y += 5;

  doc.setFontSize(BODY_SIZE);
  doc.setFont("helvetica", "normal");
  addWrappedText(doc, narrative.content, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);

  return doc;
}

export function buildAllNarrativesPdf(narratives: NarrativeItem[]): jsPDF {
  const doc = new jsPDF();
  let y = MARGIN;

  doc.setFontSize(HEADING_SIZE + 2);
  doc.setFont("helvetica", "bold");
  y = addWrappedText(
    doc,
    "Disclosure Narratives",
    MARGIN,
    y,
    CONTENT_WIDTH,
    LINE_HEIGHT + 2
  );
  y += 10;

  narratives.forEach((narrative, index) => {
    const label =
      narrative.title ||
      narrativeTypeLabels[narrative.type] ||
      `Narrative ${index + 1}`;

    if (y > PAGE_HEIGHT - 60) {
      doc.addPage();
      y = MARGIN;
    }

    doc.setFontSize(HEADING_SIZE - 2);
    doc.setFont("helvetica", "bold");
    y = addWrappedText(
      doc,
      `${index + 1}. ${label}`,
      MARGIN,
      y,
      CONTENT_WIDTH,
      LINE_HEIGHT + 1
    );
    y += 3;

    doc.setFontSize(BODY_SIZE);
    doc.setFont("helvetica", "normal");
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

  doc.setFontSize(HEADING_SIZE);
  doc.setFont("helvetica", "bold");
  let y = MARGIN;
  y = addWrappedText(doc, title, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT + 2);

  y += 5;

  doc.setFontSize(BODY_SIZE);
  doc.setFont("helvetica", "normal");
  addWrappedText(doc, letter.content, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);

  return doc;
}

export function buildAllDocumentsPdf(
  narratives: NarrativeItem[],
  letter: ResponseLetter | null
): jsPDF {
  const doc = new jsPDF();
  let y = MARGIN;

  // Narratives section
  if (narratives.length > 0) {
    doc.setFontSize(HEADING_SIZE + 2);
    doc.setFont("helvetica", "bold");
    y = addWrappedText(
      doc,
      "Disclosure Narratives",
      MARGIN,
      y,
      CONTENT_WIDTH,
      LINE_HEIGHT + 2
    );
    y += 10;

    narratives.forEach((narrative, index) => {
      const label =
        narrative.title ||
        narrativeTypeLabels[narrative.type] ||
        `Narrative ${index + 1}`;

      if (y > PAGE_HEIGHT - 60) {
        doc.addPage();
        y = MARGIN;
      }

      doc.setFontSize(HEADING_SIZE - 2);
      doc.setFont("helvetica", "bold");
      y = addWrappedText(
        doc,
        `${index + 1}. ${label}`,
        MARGIN,
        y,
        CONTENT_WIDTH,
        LINE_HEIGHT + 1
      );
      y += 3;

      doc.setFontSize(BODY_SIZE);
      doc.setFont("helvetica", "normal");
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

    doc.setFontSize(HEADING_SIZE + 2);
    doc.setFont("helvetica", "bold");
    y = addWrappedText(doc, title, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT + 2);
    y += 10;

    doc.setFontSize(BODY_SIZE);
    doc.setFont("helvetica", "normal");
    addWrappedText(doc, letter.content, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);
  }

  return doc;
}

export function downloadPdf(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
