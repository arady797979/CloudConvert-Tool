import type { FileCategory } from '../types/converter';
import { convertImages } from './converters/imageConverter';
import { convertText } from './converters/textConverter';
import { convertDocument } from './converters/documentConverter';
import { convertSpreadsheet } from './converters/spreadsheetConverter';

/**
 * CONVERTER ORCHESTRATOR
 * ──────────────────────────────────────────────────────────
 * Routes a batch of same-category files to the correct sub-module.
 *
 * IMPORTANT: Files passed here must all share the same category.
 * The UI groups files by category before calling this.
 */
export async function convertFiles(
  files: File[],
  category: FileCategory
): Promise<Blob> {
  if (files.length === 0) throw new Error('No files to convert');

  switch (category) {
    case 'image':
      return convertImages(files);

    case 'document':
      return convertDocument(files);

    case 'spreadsheet':
      return convertSpreadsheet(files);

    case 'text':
    case 'code':
      return convertText(files);

    case 'unsupported':
    default:
      throw new Error(`Unsupported file category: ${category}`);
  }
}

/**
 * Trigger a browser download for a given Blob.
 */
export function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
