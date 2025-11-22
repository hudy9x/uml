import { CompletionContext, CompletionResult, Completion } from '@codemirror/autocomplete';

const keywords = [
  'actor',
  'participant',
  'boundary',
  'control',
  'entity',
  'database',
  'collections',
  'queue',
  'title',
  'note',
  'legend',
  'left',
  'right',
  'of',
  'header',
  'footer',
  'center',
  'box',
  'alt',
  'else',
  'opt',
  'loop',
  'par',
  'break',
  'critical',
  'group'
];

const snippets: Completion[] = [
  {
    label: 'startuml',
    type: 'keyword',
    detail: 'Start UML diagram',
    info: 'Begins a new UML diagram',
    apply: '@startuml\n\n@enduml',
  },
  {
    label: 'note',
    type: 'keyword',
    detail: 'Add a note',
    info: 'Adds a note to the diagram',
    apply: 'note left\n ${1:message} \nend note',
  },
  {
    label: 'section',
    type: 'keyword',
    detail: 'Add a section',
    info: 'Adds a section title',
    apply: '== Section Title ==',
  },
  {
    label: 'message',
    type: 'keyword',
    detail: 'Add a message',
    info: 'Adds a message between participants',
    apply: '${1:sender} -> ${2:receiver}: ${3:message}',
  }
];

export function plantUMLCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/);
  if (!word) return null;

  if (word.from == word.to && !context.explicit)
    return null;

  const options: Completion[] = [
    ...keywords.map(keyword => ({
      label: keyword,
      type: 'keyword' as const,
      boost: 1
    })),
    ...snippets
  ];

  return {
    from: word.from,
    options,
    validFor: /^\w*$/
  };
}
