/**
 * Format Mermaid code with proper indentation
 */
export function formatMermaidCode(code: string): string {
  const lines = code.split('\n');
  const formatted: string[] = [];
  let indentLevel = 0;
  const INDENT = '  '; // 2 spaces

  // Diagram type keywords that start a diagram
  const diagramTypes = [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram',
    'stateDiagram', 'erDiagram', 'gantt', 'pie', 'journey',
    'gitGraph', 'mindmap', 'timeline'
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      formatted.push('');
      continue;
    }

    // Check if this is a diagram type declaration
    const isDiagramType = diagramTypes.some(type => trimmed.startsWith(type));

    if (isDiagramType) {
      // Diagram type is not indented
      formatted.push(trimmed);
      indentLevel = 1; // Start indenting content after diagram type
      continue;
    }

    // Decrease indent for 'end'
    if (trimmed === 'end') {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted.push(INDENT.repeat(indentLevel) + trimmed);
      continue;
    }

    // Handle 'else' - same level as 'alt'
    if (trimmed.startsWith('else')) {
      // Decrease indent to match 'alt' level
      indentLevel = Math.max(0, indentLevel - 1);
      formatted.push(INDENT.repeat(indentLevel) + trimmed);
      // Increase indent for content after 'else'
      indentLevel++;
      continue;
    }

    // Add indented line
    formatted.push(INDENT.repeat(indentLevel) + trimmed);

    // Increase indent after block-starting keywords
    if (
      trimmed.startsWith('subgraph') ||
      trimmed.startsWith('loop') ||
      trimmed.startsWith('alt') ||
      trimmed.startsWith('opt') ||
      trimmed.startsWith('par') ||
      trimmed.startsWith('rect')
    ) {
      indentLevel++;
    }
  }

  return formatted.join('\n');
}
