/**
 * Represents a file staged for conversion.
 */
export interface StagedFile {
  id: string;
  file: File;
  category: FileCategory;
  status: FileStatus;
  error?: string;
}

/** High-level category determines which converter sub-module is used. */
export type FileCategory =
  | 'image'
  | 'document'
  | 'spreadsheet'
  | 'text'
  | 'code'
  | 'unsupported';

export type FileStatus = 'pending' | 'converting' | 'done' | 'error';

/** Metadata about a supported file type */
export interface SupportedType {
  extensions: string[];
  mimeTypes: string[];
  label: string;
  category: FileCategory;
}

/** Result of a successful conversion */
export interface ConversionResult {
  blob: Blob;
  fileName: string;
}
