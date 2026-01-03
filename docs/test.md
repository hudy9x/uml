# Test Markdown File

This is a **test** markdown file to demonstrate the markdown viewer.

## Features

- **Bold text**
- *Italic text*
- `Code snippets`

## Code Block

```javascript
function hello() {
  console.log("Hello, World!");
}
```

## Code block

```javascript
import { MarkdownProvider } from './MarkdownContext';
import { MarkdownViewer } from './MarkdownViewer';

interface MarkdownContainerProps {
  content: string;
  filePath?: string | null;
}

export function MarkdownContainer({ content, filePath }: MarkdownContainerProps) {
  return (
    <MarkdownProvider initialContent={content} filePath={filePath}>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <MarkdownViewer />
        </div>
      </div>
    </MarkdownProvider>
  );
}

```

## Lists

1. First item
2. Second item
3. Third item

### Nested List

- Item 1
  - Subitem 1.1
  - Subitem 1.2
- Item 2

## Blockquote

> This is a blockquote
> It can span multiple lines

## Links

[Visit GitHub](https://github.com)

---

That's all for now!
