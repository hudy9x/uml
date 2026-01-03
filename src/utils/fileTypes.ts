/**
 * File type detection utilities
 */

export enum FileType {
  DIAGRAM = 'diagram',
  MARKDOWN = 'markdown',
  UNKNOWN = 'unknown',
}

/**
 * Detect file type based on file extension
 */
export function detectFileType(filename: string): FileType {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'mmd':
    case 'mermaid':
      return FileType.DIAGRAM;

    case 'md':
    case 'markdown':
      return FileType.MARKDOWN;

    default:
      return FileType.UNKNOWN;
  }
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if file is a diagram file
 */
export function isDiagramFile(filename: string): boolean {
  return detectFileType(filename) === FileType.DIAGRAM;
}

/**
 * Check if file is a markdown file
 */
export function isMarkdownFile(filename: string): boolean {
  return detectFileType(filename) === FileType.MARKDOWN;
}
