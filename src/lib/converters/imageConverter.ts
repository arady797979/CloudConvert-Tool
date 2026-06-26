import { PDFDocument } from 'pdf-lib';

/**
 * IMAGE CONVERTER
 * ──────────────────────────────────────────────────────────
 * Handles: JPEG, PNG, GIF, WebP, BMP, SVG, TIFF, ICO
 *
 * Strategy:
 *  - JPEG / PNG  → embedded directly via pdf-lib (no canvas round-trip)
 *  - Everything else → drawn onto a canvas via browser Image API,
 *    exported as PNG, then embedded via pdf-lib
 *
 * Each image becomes its own page sized to match the image dimensions.
 */

async function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = objectUrl;
  });
}

async function fileToEmbeddableBytes(
  pdfDoc: PDFDocument,
  file: File
): Promise<{ image: Awaited<ReturnType<PDFDocument['embedJpg']>>; }> {
  const type = file.type;
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Native embed — no quality loss
  if (type === 'image/jpeg' || type === 'image/jpg') {
    const image = await pdfDoc.embedJpg(bytes as any);
    return { image };
  }
  if (type === 'image/png') {
    const image = await pdfDoc.embedPng(bytes as any);
    return { image };
  }

  // Canvas path for all other formats
  const canvas = await loadImageToCanvas(file);
  const pngDataUrl = canvas.toDataURL('image/png');
  const base64 = pngDataUrl.split(',')[1];
  const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const image = await pdfDoc.embedPng(pngBytes as any);
  return { image };
}

export async function convertImages(files: File[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const { image } = await fileToEmbeddableBytes(pdfDoc, file);
    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes as any], { type: 'application/pdf' });
}
