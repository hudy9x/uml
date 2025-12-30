import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEffect, useRef, useCallback } from 'react';
import { useMarkdownContent } from './MarkdownContext';
import { useEditorVisibility, MarkdownActions } from './MarkdownActions';
import { SavingIndicator } from './SavingIndicator';

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
  const { content, setContent, saveFile } = useMarkdownContent();
  const isEditorVisible = useEditorVisibility();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save handler with 300ms delay
  const handleContentChange = useCallback((markdownContent: string) => {
    setContent(markdownContent);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for 300ms
    saveTimeoutRef.current = setTimeout(() => {
      saveFile(markdownContent);
    }, 300);
  }, [setContent, saveFile]);

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
    editable: !isEditorVisible, // Disable editing when editor is visible
    onUpdate: ({ editor }) => {
      // Only save when editor is NOT visible (user is editing in viewer)
      if (!isEditorVisible) {
        const markdownContent = editor.getMarkdown();
        handleContentChange(markdownContent);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-full',
      },
    },
  });


  // Update editor content when content changes from external source (e.g., editor)
  useEffect(() => {
    if (editor && content !== editor.getMarkdown()) {
      editor.commands.setContent(content, { contentType: 'markdown' });
    }
  }, [content, editor]);

  // Update editor editable state when visibility changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isEditorVisible);
    }
  }, [isEditorVisible, editor]);

  console.log('markdown renderer')

  return (
    <div className="h-full w-full bg-background">
      {/* Fixed controls in top-right */}
      <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
        <SavingIndicator />
        <MarkdownActions />
      </div>

      {/* Content */}
      <div className="h-full w-full overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

