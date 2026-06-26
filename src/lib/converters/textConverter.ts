import { jsPDF } from 'jspdf';
import { marked } from 'marked';

/**
 * TEXT / MARKUP CONVERTER
 * ──────────────────────────────────────────────────────────
 * Handles: TXT, MD, HTML, RTF, and all code file extensions
 *
 * Strategy:
 *  - HTML files → render to an off-screen div, capture with browser print API
 *    via jsPDF's html() method
 *  - Markdown → convert to HTML first via `marked`, then same path
 *  - Plain text / code → wrap in a <pre> block for monospace rendering
 *  - RTF → strip RTF control codes, treat as plain text
 *
 * jsPDF handles multi-page text wrapping automatically.
 */

const MARGIN_MM = 18;
const USABLE_WIDTH = 210 - MARGIN_MM * 2;

// ── RTF helpers ──────────────────────────────────────────────────────────────

function stripRtfControlCodes(rtf: string): string {
  // Remove RTF header and control words
  return rtf
    .replace(/\\[a-z]+\d*[ ]?/gi, ' ')
    .replace(/[{}\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── HTML render via jsPDF.html() ─────────────────────────────────────────────

async function htmlToPdf(htmlContent: string): Promise<Blob> {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 750px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 14px;
    line-height: 1.7;
    color: #1a1a1a;
    background: #ffffff;
    padding: 40px;
    box-sizing: border-box;
  `;
  container.innerHTML = `
    <style>
      h1,h2,h3,h4 { font-family: Arial, sans-serif; margin: 1em 0 0.5em; color: #111; }
      p { margin: 0 0 0.8em; }
      ul, ol { padding-left: 1.5em; margin: 0 0 0.8em; }
      code { background: #f3f4f6; border-radius: 3px; padding: 2px 5px; font-size: 0.9em; font-family: monospace; }
      pre { background: #f3f4f6; padding: 1em; border-radius: 6px; overflow: auto; font-family: monospace; font-size: 0.85em; }
      blockquote { border-left: 4px solid #e5e7eb; padding-left: 1em; color: #6b7280; margin: 0.5em 0; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
      th, td { border: 1px solid #e5e7eb; padding: 6px 10px; text-align: left; font-size: 0.9em; }
      th { background: #f9fafb; font-weight: 600; }
      a { color: #4f46e5; }
      hr { border: none; border-top: 1px solid #e5e7eb; margin: 1em 0; }
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

// ── Plain text / code rendering ──────────────────────────────────────────────

function textToHtml(text: string, isCode: boolean, fileName: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (isCode) {
    return `
      <h2 style="font-family: Arial; font-size:14px; color:#4f46e5; margin-bottom:12px;">${fileName}</h2>
      <pre style="font-family: 'Courier New', Courier, monospace; font-size: 11px; line-height:1.5; 
                  background:#f8f9fa; padding:16px; border-radius:6px; white-space:pre-wrap; word-break:break-all;">
${escaped}
      </pre>`;
  }

  return `<div style="font-family: Georgia, serif; font-size: 13px; line-height: 1.8; color: #1a1a1a; white-space: pre-wrap;">${escaped}</div>`;
}

// ── Public converter ─────────────────────────────────────────────────────────

export async function convertText(files: File[]): Promise<Blob> {
  // For multiple files, build one big HTML document
  const htmlParts: string[] = [];

  for (const file of files) {
    const raw = await file.text();
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');

    if (ext === '.html' || ext === '.htm') {
      // Extract body content to avoid full-document nesting issues
      const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      htmlParts.push(bodyMatch ? bodyMatch[1] : raw);

    } else if (ext === '.md' || ext === '.markdown') {
      const html = await marked.parse(raw);
      htmlParts.push(html as string);

    } else if (ext === '.rtf') {
      const stripped = stripRtfControlCodes(raw);
      htmlParts.push(textToHtml(stripped, false, file.name));

    } else {
      // Plain text or code
      const isCode = !['.txt', '.rtf'].includes(ext);
      htmlParts.push(textToHtml(raw, isCode, file.name));
    }

    // Page separator between files
    if (files.indexOf(file) < files.length - 1) {
      htmlParts.push('<div style="page-break-after:always;"></div>');
    }
  }

  return htmlToPdf(htmlParts.join('\n'));
}
