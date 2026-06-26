import type { FileCategory, SupportedType } from '../types/converter';

/**
 * Central registry of all supported file types.
 * To add a new format: add an entry here and implement a handler in the
 * appropriate converter sub-module.
 */
export const SUPPORTED_TYPES: SupportedType[] = [
  // ── Images ────────────────────────────────────────────────────────────────
  {
    extensions: ['.jpg', '.jpeg'],
    mimeTypes: ['image/jpeg'],
    label: 'JPEG Image',
    category: 'image',
  },
  {
    extensions: ['.png'],
    mimeTypes: ['image/png'],
    label: 'PNG Image',
    category: 'image',
  },
  {
    extensions: ['.gif'],
    mimeTypes: ['image/gif'],
    label: 'GIF Image',
    category: 'image',
  },
  {
    extensions: ['.webp'],
    mimeTypes: ['image/webp'],
    label: 'WebP Image',
    category: 'image',
  },
  {
    extensions: ['.bmp'],
    mimeTypes: ['image/bmp'],
    label: 'BMP Image',
    category: 'image',
  },
  {
    extensions: ['.svg'],
    mimeTypes: ['image/svg+xml'],
    label: 'SVG Image',
    category: 'image',
  },
  {
    extensions: ['.tiff', '.tif'],
    mimeTypes: ['image/tiff'],
    label: 'TIFF Image',
    category: 'image',
  },
  {
    extensions: ['.ico'],
    mimeTypes: ['image/x-icon', 'image/vnd.microsoft.icon'],
    label: 'ICO Image',
    category: 'image',
  },

  // ── Documents ─────────────────────────────────────────────────────────────
  {
    extensions: ['.docx'],
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    label: 'Word Document',
    category: 'document',
  },
  {
    extensions: ['.odt'],
    mimeTypes: ['application/vnd.oasis.opendocument.text'],
    label: 'OpenDocument Text',
    category: 'document',
  },
  {
    extensions: ['.rtf'],
    mimeTypes: ['text/rtf', 'application/rtf'],
    label: 'Rich Text Format',
    category: 'text',
  },

  // ── Spreadsheets ──────────────────────────────────────────────────────────
  {
    extensions: ['.xlsx'],
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    label: 'Excel Spreadsheet',
    category: 'spreadsheet',
  },
  {
    extensions: ['.xls'],
    mimeTypes: ['application/vnd.ms-excel'],
    label: 'Excel 97-2003',
    category: 'spreadsheet',
  },
  {
    extensions: ['.csv'],
    mimeTypes: ['text/csv', 'application/csv'],
    label: 'CSV File',
    category: 'spreadsheet',
  },
  {
    extensions: ['.ods'],
    mimeTypes: ['application/vnd.oasis.opendocument.spreadsheet'],
    label: 'OpenDocument Spreadsheet',
    category: 'spreadsheet',
  },

  // ── Plain Text & Markup ───────────────────────────────────────────────────
  {
    extensions: ['.txt'],
    mimeTypes: ['text/plain'],
    label: 'Plain Text',
    category: 'text',
  },
  {
    extensions: ['.md', '.markdown'],
    mimeTypes: ['text/markdown', 'text/x-markdown'],
    label: 'Markdown',
    category: 'text',
  },
  {
    extensions: ['.html', '.htm'],
    mimeTypes: ['text/html'],
    label: 'HTML File',
    category: 'text',
  },

  // ── Code ──────────────────────────────────────────────────────────────────
  {
    extensions: ['.js', '.mjs', '.cjs'],
    mimeTypes: ['text/javascript', 'application/javascript'],
    label: 'JavaScript',
    category: 'code',
  },
  {
    extensions: ['.ts', '.tsx'],
    mimeTypes: ['text/typescript'],
    label: 'TypeScript',
    category: 'code',
  },
  {
    extensions: ['.jsx'],
    mimeTypes: ['text/jsx'],
    label: 'JSX',
    category: 'code',
  },
  {
    extensions: ['.py'],
    mimeTypes: ['text/x-python'],
    label: 'Python',
    category: 'code',
  },
  {
    extensions: ['.java'],
    mimeTypes: ['text/x-java-source'],
    label: 'Java',
    category: 'code',
  },
  {
    extensions: ['.css'],
    mimeTypes: ['text/css'],
    label: 'CSS',
    category: 'code',
  },
  {
    extensions: ['.json'],
    mimeTypes: ['application/json'],
    label: 'JSON',
    category: 'code',
  },
  {
    extensions: ['.xml'],
    mimeTypes: ['text/xml', 'application/xml'],
    label: 'XML',
    category: 'code',
  },
  {
    extensions: ['.yaml', '.yml'],
    mimeTypes: ['text/yaml', 'application/yaml'],
    label: 'YAML',
    category: 'code',
  },
  {
    extensions: ['.sh', '.bash'],
    mimeTypes: ['text/x-sh'],
    label: 'Shell Script',
    category: 'code',
  },
  {
    extensions: ['.rs'],
    mimeTypes: ['text/x-rust'],
    label: 'Rust',
    category: 'code',
  },
  {
    extensions: ['.go'],
    mimeTypes: ['text/x-go'],
    label: 'Go',
    category: 'code',
  },
  {
    extensions: ['.cpp', '.cc', '.c', '.h'],
    mimeTypes: ['text/x-c', 'text/x-c++src'],
    label: 'C/C++',
    category: 'code',
  },
  {
    extensions: ['.php'],
    mimeTypes: ['text/x-php'],
    label: 'PHP',
    category: 'code',
  },
  {
    extensions: ['.rb'],
    mimeTypes: ['text/x-ruby'],
    label: 'Ruby',
    category: 'code',
  },
  {
    extensions: ['.swift'],
    mimeTypes: ['text/x-swift'],
    label: 'Swift',
    category: 'code',
  },
  {
    extensions: ['.kt'],
    mimeTypes: ['text/x-kotlin'],
    label: 'Kotlin',
    category: 'code',
  },
  {
    extensions: ['.sql'],
    mimeTypes: ['text/x-sql', 'application/sql'],
    label: 'SQL',
    category: 'code',
  },
  {
    extensions: ['.toml'],
    mimeTypes: ['text/x-toml'],
    label: 'TOML',
    category: 'code',
  },
  {
    extensions: ['.ini', '.env'],
    mimeTypes: ['text/x-ini'],
    label: 'Config / INI',
    category: 'code',
  },
];

/** Flat list of all accepted extensions for the dropzone accept prop */
export const ALL_ACCEPTED_EXTENSIONS = SUPPORTED_TYPES.flatMap(
  (t) => t.extensions
);

/** Build the dropzone `accept` record from the registry */
export const DROPZONE_ACCEPT = SUPPORTED_TYPES.reduce<Record<string, string[]>>(
  (acc, type) => {
    type.mimeTypes.forEach((mime) => {
      if (!acc[mime]) acc[mime] = [];
      acc[mime].push(...type.extensions);
    });
    return acc;
  },
  {}
);

/**
 * Determine the FileCategory for a given file by checking both MIME type
 * and file extension (extension wins for edge cases like .env).
 */
export function getCategoryForFile(file: File): FileCategory {
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
  const match =
    SUPPORTED_TYPES.find((t) => t.extensions.includes(ext)) ??
    SUPPORTED_TYPES.find((t) => t.mimeTypes.includes(file.type));
  return match?.category ?? 'unsupported';
}

/** Human-readable label for a file from the registry */
export function getLabelForFile(file: File): string {
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
  const match =
    SUPPORTED_TYPES.find((t) => t.extensions.includes(ext)) ??
    SUPPORTED_TYPES.find((t) => t.mimeTypes.includes(file.type));
  return match?.label ?? 'Unknown';
}

/** Format bytes into human-readable string */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
