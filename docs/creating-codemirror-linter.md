# Creating a CodeMirror Linter

This guide explains how to create a custom linter for CodeMirror 6 to provide syntax error highlighting in the editor.

## Overview

A linter analyzes code and reports diagnostics (errors, warnings, info) that are displayed in the editor with underlines and hover messages, similar to VS Code.

## Step 1: Install Dependencies

```bash
pnpm add @codemirror/lint
```

## Step 2: Create the Linter Function

Create a new file for your linter (e.g., `plantuml-linter.ts`):

```typescript
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';

/**
 * Lint function that analyzes code and returns diagnostics
 */
export function lintPlantUML(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc;
  const lines = doc.toString().split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Example: Check for empty message after colon
    const emptyMessageRegex = /^\s*\w+\s*->\s*\w+\s*:\s*$/;
    if (emptyMessageRegex.test(line)) {
      const from = doc.line(i + 1).from;
      const to = doc.line(i + 1).to;
      
      diagnostics.push({
        from,           // Start position in document
        to,             // End position in document
        severity: 'error',  // 'error', 'warning', or 'info'
        message: 'Message text is required after colon (:)',
      });
    }
  }

  return diagnostics;
}
```

## Step 3: Integrate with Language Support

Import and add the linter to your language extension:

```typescript
import { LanguageSupport } from '@codemirror/language';
import { linter } from '@codemirror/lint';
import { lintPlantUML } from './plantuml-linter';

export function plantUML() {
  return new LanguageSupport(plantumlLanguage, [
    // ... other extensions
    linter(lintPlantUML)  // Add linter here
  ]);
}
```

## Key Concepts

### Diagnostic Object

```typescript
interface Diagnostic {
  from: number;        // Start position in document
  to: number;          // End position in document
  severity: 'error' | 'warning' | 'info';
  message: string;     // Error message shown on hover
  source?: string;     // Optional: source of the diagnostic
  actions?: Action[];  // Optional: quick fix actions
}
```

### Getting Line Positions

```typescript
// Get line object (1-indexed)
const lineObj = doc.line(lineNumber);

// Line positions
const from = lineObj.from;  // Start of line
const to = lineObj.to;      // End of line
```

### Severity Levels

- **`error`**: Red underline, indicates syntax errors
- **`warning`**: Yellow/orange underline, indicates potential issues
- **`info`**: Blue underline, indicates informational messages

## Example: Multiple Error Types

```typescript
export function lintPlantUML(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc;
  const lines = doc.toString().split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip comments and empty lines
    if (!line || line.startsWith("'")) continue;
    
    // Error: Empty message after colon
    if (/^\w+\s*->\s*\w+\s*:\s*$/.test(line)) {
      diagnostics.push({
        from: doc.line(i + 1).from,
        to: doc.line(i + 1).to,
        severity: 'error',
        message: 'Message text is required after colon',
      });
    }
    
    // Warning: Missing participant declaration
    if (/^\w+\s*->\s*\w+/.test(line)) {
      const participants = line.match(/\w+/g);
      // Check if participants are declared...
      diagnostics.push({
        from: doc.line(i + 1).from,
        to: doc.line(i + 1).to,
        severity: 'warning',
        message: 'Participant not declared',
      });
    }
  }

  return diagnostics;
}
```

## Best Practices

1. **Performance**: Keep linting fast - it runs on every change
2. **Specific Errors**: Provide clear, actionable error messages
3. **Skip Irrelevant Lines**: Skip comments, empty lines, directives
4. **Use Regex Carefully**: Test regex patterns thoroughly
5. **Return Empty Array**: If no errors, return `[]` not `null`

## Debugging

Add console logs to see what's being detected:

```typescript
if (emptyMessageRegex.test(line)) {
  console.log('Found error on line', i + 1, ':', line);
  diagnostics.push({...});
}
```

## See Also

- [CodeMirror Linting Documentation](https://codemirror.net/docs/ref/#lint)
- [Detecting PlantUML Syntax](./detecting-plantuml-syntax.md)
