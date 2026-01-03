const INDENT = '  '; // 2 spaces

/**
 * Format sequence diagram with proper indentation
 */
function formatSequenceDiagram(lines: string[]): string[] {
  const formatted: string[] = [];
  let indentLevel = 0;
  let foundDiagramType = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      formatted.push('');
      continue;
    }

    // Diagram type declaration
    if (trimmed.startsWith('sequenceDiagram')) {
      formatted.push(trimmed);
      foundDiagramType = true;
      indentLevel = 1;
      continue;
    }

    if (!foundDiagramType) {
      formatted.push(trimmed);
      continue;
    }

    // Handle 'end'
    if (trimmed === 'end') {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted.push(INDENT.repeat(indentLevel) + trimmed);
      continue;
    }

    // Handle 'else' - same level as 'alt'
    if (trimmed.startsWith('else')) {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted.push(INDENT.repeat(indentLevel) + trimmed);
      indentLevel++;
      continue;
    }

    // Add indented line
    formatted.push(INDENT.repeat(indentLevel) + trimmed);

    // Increase indent after block-starting keywords
    if (
      trimmed.startsWith('loop') ||
      trimmed.startsWith('alt') ||
      trimmed.startsWith('opt') ||
      trimmed.startsWith('par') ||
      trimmed.startsWith('rect')
    ) {
      indentLevel++;
    }
  }

  return formatted;
}

/**
 * Format class diagram with proper indentation
 */
function formatClassDiagram(lines: string[]): string[] {
  const formatted: string[] = [];
  let indentLevel = 0;
  let foundDiagramType = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      formatted.push('');
      continue;
    }

    // Diagram type declaration
    if (trimmed.startsWith('classDiagram')) {
      formatted.push(trimmed);
      foundDiagramType = true;
      indentLevel = 1;
      continue;
    }

    if (!foundDiagramType) {
      formatted.push(trimmed);
      continue;
    }

    // Handle closing brace for class definition
    if (trimmed === '}') {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted.push(INDENT.repeat(indentLevel) + trimmed);
      continue;
    }

    // Add indented line
    formatted.push(INDENT.repeat(indentLevel) + trimmed);

    // Increase indent after class definition opening
    if (trimmed.startsWith('class ') && trimmed.endsWith('{')) {
      indentLevel++;
    }
  }

  return formatted;
}

/**
 * Detect diagram type from code
 */
function detectDiagramType(code: string): string | null {
  const lines = code.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('sequenceDiagram')) return 'sequence';
    if (trimmed.startsWith('classDiagram')) return 'class';
    if (trimmed.startsWith('stateDiagram')) return 'state';
    if (trimmed.startsWith('flowchart') || trimmed.startsWith('graph ')) return 'flowchart';
    if (trimmed.startsWith('erDiagram')) return 'er';
    if (trimmed.startsWith('gantt')) return 'gantt';
    if (trimmed.startsWith('pie')) return 'pie';
    if (trimmed.startsWith('journey')) return 'journey';
    if (trimmed.startsWith('gitGraph')) return 'gitGraph';
  }

  return null;
}

/**
 * Format Mermaid code with proper indentation based on diagram type
 */
export function formatMermaidCode(code: string): string {
  const lines = code.split('\n');
  const diagramType = detectDiagramType(code);

  let formatted: string[];

  switch (diagramType) {
    case 'sequence':
      formatted = formatSequenceDiagram(lines);
      break;
    case 'class':
      formatted = formatClassDiagram(lines);
      break;
    default:
      // For unsupported diagram types, return original code
      return code;
  }

  return formatted.join('\n');
}
