import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createTauriImage } from './TauriImage';
import { common, createLowlight } from 'lowlight';
import { useEffect, useRef, useCallback } from 'react';
import { useMarkdownContent } from './MarkdownContext';
import { useEditorMode } from './MarkdownActions';

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
  const { content, setContent, saveFile, filePath } = useMarkdownContent();
  const mode = useEditorMode();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<any>(null);

  // Debounced save handler with 300ms delay
  const handleContentChange = useCallback((markdownContent: string) => {
    // In preview-only mode: only save to file, don't update context state
    // This prevents re-render and maintains scroll position/focus
    if (mode === 'preview') {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for 300ms - only save, don't update state
      saveTimeoutRef.current = setTimeout(() => {
        saveFile(markdownContent);
      }, 300);
    } else {
      // In split/code mode: update state and save
      setContent(markdownContent);

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for 300ms
      saveTimeoutRef.current = setTimeout(() => {
        saveFile(markdownContent);
      }, 300);
    }
  }, [mode, setContent, saveFile]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
      createTauriImage(filePath).configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'markdown-image',
        },
      }),
      Markdown,
    ],
    content: content,
    contentType: 'markdown',
    editable: mode === 'preview', // Only editable in preview mode
    onUpdate: ({ editor }) => {
      // Only save when in preview mode (user is editing in viewer)
      if (mode === 'preview') {
        const markdownContent = editor.getMarkdown();
        handleContentChange(markdownContent);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-full',
      },
    },
  }, [mode, handleContentChange, content, filePath]);

  // Store editor ref
  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);


  // Update editor content when content changes from external source (e.g., Monaco editor)
  useEffect(() => {
    if (editor && content !== editor.getMarkdown()) {
      editor.commands.setContent(content, { contentType: 'markdown' });
    }
  }, [content, editor]);

  // Get latest content from TipTap before switching to split mode
  const prevModeRef = useRef(mode);
  useEffect(() => {
    const wasPreview = prevModeRef.current === 'preview';
    const isNowSplit = mode === 'split';

    // When switching from preview to split, get latest content from TipTap and update context
    if (wasPreview && isNowSplit && editorRef.current) {
      const latestContent = editorRef.current.getMarkdown();
      console.log('[MarkdownViewer] Switching to split mode, updating context with latest content');
      setContent(latestContent);
    }

    // Update ref for next render
    prevModeRef.current = mode;
  }, [mode, setContent]);

  // Update editor editable state when mode changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(mode === 'preview');
    }
  }, [mode, editor]);

  console.log('markdown renderer')

  return (
    <div className="h-full w-full bg-background">
      {/* Content */}
      <div className="h-full w-full overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

