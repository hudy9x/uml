import Image from '@tiptap/extension-image';
import { convertFileSrc } from '@tauri-apps/api/core';

/**
 * Custom Image extension for Tauri that handles local file paths
 * and resolves relative paths based on the markdown file location
 */
export const createTauriImage = (markdownFilePath: string | null) => {
  return Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        src: {
          default: null,
          parseHTML: element => element.getAttribute('src'),
          renderHTML: attributes => {
            if (!attributes.src) {
              return {};
            }

            let src = attributes.src;

            // Check if it's a URL or data URI - use as-is
            const isUrl = src.startsWith('http://') ||
              src.startsWith('https://') ||
              src.startsWith('data:');

            if (isUrl) {
              return { src };
            }

            // Resolve relative paths to absolute paths
            if (markdownFilePath && (src.startsWith('./') || src.startsWith('../') || !src.startsWith('/'))) {
              const markdownDir = markdownFilePath.substring(0, markdownFilePath.lastIndexOf('/'));

              if (src.startsWith('./')) {
                src = `${markdownDir}/${src.substring(2)}`;
              } else if (src.startsWith('../')) {
                let path = src;
                let dir = markdownDir;
                while (path.startsWith('../')) {
                  path = path.substring(3);
                  const parentSlash = dir.lastIndexOf('/');
                  dir = parentSlash >= 0 ? dir.substring(0, parentSlash) : '';
                }
                src = `${dir}/${path}`;
              } else if (!src.startsWith('/')) {
                // Relative path without ./ prefix
                src = `${markdownDir}/${src}`;
              }
            }

            // Convert local file paths to Tauri asset protocol
            try {
              src = convertFileSrc(src);
            } catch (error) {
              console.error('[TauriImage] Failed to convert file path:', src, error);
            }

            return { src };
          },
        },
      };
    },
  });
};
