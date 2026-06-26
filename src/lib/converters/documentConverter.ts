import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

/**
 * DOCUMENT CONVERTER
 * ──────────────────────────────────────────────────────────
 * Handles: DOCX, ODT
 *
 * Strategy:
 *  - DOCX  → mammoth extracts HTML with style mapping → jsPDF renders
 *  - ODT   → mammoth also supports ODT via ArrayBuffer
 */

const MARGIN_MM = 18;
const USABLE_WIDTH = 210 - MARGIN_MM * 2;

async function renderHtmlToPdfBlob(htmlContent: string): Promise<Blob> {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 750px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 13px;
    line-height: 1.75;
    color: #1a1a1a;
    background: white;
    padding: 40px;
    box-sizing: border-box;
  `;
  container.innerHTML = `
    <style>
      h1 { font-size: 22px; color: #111; margin: 0 0 12px; }
      h2 { font-size: 18px; color: #222; margin: 16px 0 8px; }
      h3 { font-size: 15px; color: #333; margin: 12px 0 6px; }
      p  { margin: 0 0 10px; }
      ul, ol { padding-left: 20px; margin: 0 0 10px; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
      td, th { border: 1px solid #d1d5db; padding: 6px 10px; font-size: 12px; }
      th { background: #f3f4f6; font-weight: 600; }
      strong { font-weight: 700; }
      em { font-style: italic; }
    </style>
    ${htmlContent}
  `;
  document.body.appendChild(container);

  const doc = new jsPDF('p', 'mm', 'a4');
  await doc.html(container, {
    callback: () => {},
    x: MARGIN_MM,
    y: MARGIN_MM,
    width: USABLE_WIDTH,
    windowWidth: 750,
    autoPaging: 'text',
    margin: [MARGIN_MM, MARGIN_MM, MARGIN_MM, MARGIN_MM],
  });

  document.body.removeChild(container);

  const arrayBuffer = doc.output('arraybuffer');
  return new Blob([arrayBuffer], { type: 'application/pdf' });
}

export async function convertDocument(files: File[]): Promise<Blob> {
  const htmlParts: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.convertToHtml({ arrayBuffer });
    if (result.messages.length) {
      console.warn(`Mammoth warnings for ${file.name}:`, result.messages);
    }

    htmlParts.push(result.value);

    if (files.indexOf(file) < files.length - 1) {
      htmlParts.push('<div style="page-break-after: always;"></div>');
    }
  }

  return renderHtmlToPdfBlob(htmlParts.join('\n'));
}
