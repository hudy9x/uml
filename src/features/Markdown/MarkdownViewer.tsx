import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEffect } from 'react';
import { useMarkdownContent, useSavingState } from './MarkdownContext';
import { Loader2 } from 'lucide-react';

import "./style.css"

// Syntax highlighting themes - uncomment one to use
// import 'highlight.js/styles/atom-one-dark.css';
import 'highlight.js/styles/github-dark.css';
// import 'highlight.js/styles/tokyo-night-dark.css';
// import 'highlight.js/styles/vs2015.css';
// import 'highlight.js/styles/monokai.css';
// import 'highlight.js/styles/dracula.css';
// import 'highlight.js/styles/night-owl.css';

// Create a lowlight instance with common languages
const lowlight = createLowlight(common);

export function MarkdownViewer() {
  const { content } = useMarkdownContent();
  const { isSaving } = useSavingState();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
      Markdown,
    ],
    content: content,
    contentType: 'markdown',
    editable: true, // Read-only mode for now
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-full',
      },
    },
  });


  // Update editor content when content changes
  useEffect(() => {
    if (editor && content) {
      console.log('set content', content)
      editor.commands.setContent(content, { contentType: 'markdown' });
    }
  }, [content, editor]);

  console.log('markdown renderer')

  return (
    <div className="h-full w-full relative bg-background">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {isSaving && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>
      <div className="h-full w-full overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

