import type { Monaco } from '@monaco-editor/react';

export function registerMermaidLanguage(monaco: Monaco) {
  // Register Mermaid language
  monaco.languages.register({ id: 'mermaid' });

  // Define tokenizer (Monarch syntax)
  monaco.languages.setMonarchTokensProvider('mermaid', {
    tokenizer: {
      root: [
        // Comments
        [/%%.*$/, 'comment'],

        // Diagram types
        [/\b(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|stateDiagram-v2|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment)\b/, 'keyword.diagram'],

        // Directions
        [/\b(TB|TD|BT|RL|LR)\b/, 'keyword.direction'],

        // Block keywords
        [/\b(subgraph|end)\b/, 'keyword.block'],

        // Sequence diagram keywords
        [/\b(participant|actor|activate|deactivate|Note|loop|alt|else|opt|par|and|rect|autonumber|over|left of|right of)\b/, 'keyword.sequence'],

        // Class diagram keywords
        [/\b(class|interface|enum|abstract|static|public|private|protected)\b/, 'keyword.class'],

        // State diagram keywords
        [/\b(state|fork|join|choice)\b/, 'keyword.state'],

        // Style keywords
        [/\b(style|classDef|class|fill|stroke|stroke-width|color|linkStyle)\b/, 'keyword.style'],

        // Arrows and connections
        [/o?--+o/, 'operator.arrow'],
        [/x--+x/, 'operator.arrow'],
        [/o--+/, 'operator.arrow'],
        [/--+x/, 'operator.arrow'],
        [/<--+>/, 'operator.arrow'],
        [/<-+>/, 'operator.arrow'],
        [/--+>/, 'operator.arrow'],
        [/-+>/, 'operator.arrow'],
        [/==+>/, 'operator.arrow'],
        [/\.\.+>/, 'operator.arrow'],
        [/--+/, 'operator.arrow'],
        [/==+/, 'operator.arrow'],
        [/\.\.+/, 'operator.arrow'],
        [/-\.-/, 'operator.arrow'],
        [/-\.->/, 'operator.arrow'],

        // Link text
        [/\|[^|]*\|/, 'string.link'],

        // Strings
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],

        // Hex colors
        [/#[0-9a-fA-F]{3,6}\b/, 'constant.color'],

        // Numbers
        [/\b\d+\b/, 'number'],

        // Node shapes and brackets
        [/[\[\]\(\)\{\}]/, 'delimiter.bracket'],
        [/[<>]/, 'delimiter.angle'],

        // Identifiers (node IDs)
        [/\b[A-Z][a-zA-Z0-9_]*\b/, 'type.identifier'],
        [/\b[a-z][a-zA-Z0-9_]*\b/, 'identifier'],
      ],
    },
  });

  // Configure language features
  monaco.languages.setLanguageConfiguration('mermaid', {
    comments: {
      lineComment: '%%',
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });
}
