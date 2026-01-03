import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import FileHandler from '@tiptap/extension-file-handler';
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
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files, pos) => {
          console.log('[FileHandler] onDrop triggered', { files, pos });
          files.forEach(file => {
            console.log('[FileHandler] Processing dropped file:', file.name, file.type);
            const fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              console.log('[FileHandler] File loaded, inserting at position:', pos);
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run()
            }
          })
        },
        onPaste: (currentEditor, files, htmlContent) => {
          console.log('[FileHandler] onPaste triggered', { files, htmlContent });
          files.forEach(file => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent)
              return false
            }

            const fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run()
            }
          })
        },
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
    editable: true, // Always editable to allow FileHandler drop events
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
      handlePaste: (_view, event) => {
        console.log('[EditorProps] handlePaste called, mode:', mode);
        // In non-preview modes, only allow file paste (handled by FileHandler)
        // Block text paste
        if (mode !== 'preview') {
          const hasFiles = event.clipboardData?.files && event.clipboardData.files.length > 0;
          if (!hasFiles) {
            console.log('[EditorProps] Blocking text paste in non-preview mode');
            return true; // Block text paste
          }
        }
        return false; // Allow paste (FileHandler will handle files)
      },
      handleTextInput: (_view) => {
        console.log('[EditorProps] handleTextInput called, mode:', mode);
        // Block text input in non-preview modes
        if (mode !== 'preview') {
          console.log('[EditorProps] Blocking text input in non-preview mode');
          return true; // Block text input
        }
        return false; // Allow text input in preview mode
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

  // Add native drop event listeners for debugging
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleDragEnter = (e: DragEvent) => {
      console.log('[Native] dragenter event', e);
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragOver = (e: DragEvent) => {
      console.log('[Native] dragover event', e);
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragLeave = (e: DragEvent) => {
      console.log('[Native] dragleave event', e);
    };

    const handleDrop = (e: DragEvent) => {
      console.log('[Native] drop event', e);
      console.log('[Native] drop files:', e.dataTransfer?.files);
      // Don't prevent default - let TipTap handle it
    };

    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);

    return () => {
      container.removeEventListener('dragenter', handleDragEnter);
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('drop', handleDrop);
    };
  }, []);

  console.log('markdown renderer')

  return (
    <div className="h-full w-full bg-background" ref={containerRef}>
      {/* Content */}
      <div className="h-full w-full overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

