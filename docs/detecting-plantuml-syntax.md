# Detecting PlantUML Syntax

This guide explains how to parse and detect PlantUML message syntax in the UML parser.

## Overview

The UML parser scans PlantUML code line by line to identify message syntax and map them to line numbers. This is used for the click-to-navigate feature.

## Message Syntax Patterns

PlantUML supports various message syntaxes:

```plantuml
' Basic message
participant1 -> participant2: message text

' Without message text
participant1 -> participant2

' Different arrow types
participant1 --> participant2: dashed arrow
participant1 <- participant2: reverse arrow
participant1 <-- participant2: dashed reverse

' With autonumbering
1 participant1 -> participant2: numbered message

' Quoted participant names
"Web App" -> "Auth Backend": login request
```

## Regular Expression Pattern

The core regex pattern used in `uml-parser.ts`:

```typescript
const messageRegex = /^\s*(?:\d+\s+)?["\w\s]+?\s*<?-{1,2}>?\s*["\w\s]+?(?:\s*:\s*.+)?$/;
```

### Pattern Breakdown

| Part | Meaning | Example |
|------|---------|---------|
| `^\s*` | Start of line, optional whitespace | `  ` |
| `(?:\d+\s+)?` | Optional autonumber | `1 ` |
| `["\w\s]+?` | From participant (words, spaces, quotes) | `app` or `"Web App"` |
| `\s*` | Optional whitespace | ` ` |
| `<?-{1,2}>?` | Arrow (1-2 dashes, optional `<` or `>`) | `->`, `-->`, `<-`, `<--` |
| `\s*` | Optional whitespace | ` ` |
| `["\w\s]+?` | To participant | `backend` |
| `(?:\s*:\s*.+)?` | Optional colon and message | `: call api` |
| `$` | End of line | |

## Implementation

### Basic Parser Function

```typescript
export function findMessageLine(
  svgMessageIndex: number,
  umlCode: string
): number | null {
  const lines = umlCode.split('\n');
  const messageRegex = /^\s*(?:\d+\s+)?["\w\s]+?\s*<?-{1,2}>?\s*["\w\s]+?(?:\s*:\s*.+)?$/;
  
  let messageCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip non-message lines
    if (shouldSkipLine(line)) continue;
    
    // Check if line matches message syntax
    if (messageRegex.test(line)) {
      if (messageCount === svgMessageIndex) {
        return i + 1; // Return 1-indexed line number
      }
      messageCount++;
    }
  }
  
  return null;
}
```

### Skipping Non-Message Lines

```typescript
function shouldSkipLine(line: string): boolean {
  if (!line) return true;  // Empty line
  
  // Skip PlantUML directives and declarations
  const skipPatterns = [
    "'",           // Comments
    "@",           // @startuml, @enduml
    "==",          // Section headers
    "title",       // Title directive
    "participant", // Participant declaration
    "autonumber",  // Autonumber directive
    "activate",    // Activation
    "deactivate",  // Deactivation
    "note",        // Notes
  ];
  
  return skipPatterns.some(pattern => line.startsWith(pattern));
}
```

## Parsing Message Details

To extract participant names and message text:

```typescript
export interface UMLMessage {
  from: string;
  to: string;
  text: string;
  lineNumber: number;
  arrowType: string;
}

export function parseUMLMessages(umlCode: string): UMLMessage[] {
  const lines = umlCode.split('\n');
  const messages: UMLMessage[] = [];
  
  // Regex with capture groups
  const messageRegex = /^\s*(?:(\d+)\s+)?(["\w\s]+?)\s*(<?\-{1,2}>?)\s*(["\w\s]+?)\s*:\s*(.+)$/;
  
  lines.forEach((line, index) => {
    const match = line.match(messageRegex);
    if (match) {
      const [, , from, arrowType, to, text] = match;
      
      messages.push({
        from: from.replace(/"/g, '').trim(),
        to: to.replace(/"/g, '').trim(),
        text: text.trim(),
        lineNumber: index + 1,
        arrowType: arrowType.trim(),
      });
    }
  });
  
  return messages;
}
```

## Arrow Type Detection

Different arrow types have different meanings:

```typescript
function getArrowType(arrow: string): string {
  const arrowTypes: Record<string, string> = {
    '->': 'sync',
    '-->': 'async',
    '<-': 'sync_return',
    '<--': 'async_return',
    '->>': 'create',
    '<<-': 'destroy',
  };
  
  return arrowTypes[arrow] || 'unknown';
}
```

## Handling Edge Cases

### Quoted Participant Names

```typescript
// Matches: "Web App" -> "Auth Service": login
const quotedRegex = /"([^"]+)"\s*(<?\-{1,2}>?)\s*"([^"]+)"\s*:\s*(.+)/;
```

### Messages Without Text

```typescript
// Matches: app -> backend (no colon or message)
const noMessageRegex = /^\s*["\w\s]+?\s*<?-{1,2}>?\s*["\w\s]+?$/;
```

### Multiline Notes

```typescript
// Skip note blocks
if (line.startsWith('note')) {
  inNoteBlock = true;
  continue;
}
if (line.startsWith('end note')) {
  inNoteBlock = false;
  continue;
}
if (inNoteBlock) continue;
```

## Testing Regex Patterns

Use online regex testers or write unit tests:

```typescript
describe('Message Regex', () => {
  const messageRegex = /^\s*(?:\d+\s+)?["\w\s]+?\s*<?-{1,2}>?\s*["\w\s]+?(?:\s*:\s*.+)?$/;
  
  it('should match basic message', () => {
    expect(messageRegex.test('app -> backend: call api')).toBe(true);
  });
  
  it('should match message without text', () => {
    expect(messageRegex.test('app -> backend')).toBe(true);
  });
  
  it('should match quoted participants', () => {
    expect(messageRegex.test('"Web App" -> "Backend": login')).toBe(true);
  });
  
  it('should not match participant declaration', () => {
    expect(messageRegex.test('participant app')).toBe(false);
  });
});
```

## Performance Considerations

1. **Compile Regex Once**: Define regex outside the loop
2. **Early Returns**: Skip lines as early as possible
3. **Avoid Backtracking**: Use non-greedy quantifiers (`+?` instead of `+`)
4. **Cache Results**: Store parsed messages if code hasn't changed

## Common Pitfalls

1. **Greedy Matching**: Use `+?` instead of `+` to avoid over-matching
2. **Whitespace**: Account for varying whitespace with `\s*`
3. **Special Characters**: Escape regex special chars: `\(`, `\)`, `\[`, `\]`
4. **Line Endings**: Handle both `\n` and `\r\n`

## See Also

- [Creating a CodeMirror Linter](./creating-codemirror-linter.md)
- [PlantUML Sequence Diagram Syntax](https://plantuml.com/sequence-diagram)
- [Regular Expression Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
