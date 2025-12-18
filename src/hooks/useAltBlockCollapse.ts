import { useEffect } from 'react';

/**
 * Custom hook to process PlantUML alt-else-end blocks in SVG diagrams
 * Marks alt text elements and their associated path elements for collapse/expand functionality
 * 
 * @param svgContent - The SVG content to process
 * @param contentType - The type of content ('svg' or 'html')
 */
export function useAltBlockCollapse(svgContent: string, contentType: 'svg' | 'html', handleAltToggle?: (altIndex: number) => void) {
  useEffect(() => {
    if (contentType !== 'svg') return;

    const altTextClass = 'alt-text'
    const altPathClass = 'alt-path'

    const processAltElements = () => {
      // Find all text elements in the SVG
      const textElements = document.querySelectorAll('.uml-preview text');
      let altCounter = 0;

      textElements.forEach((textEl) => {
        const textContent = textEl.textContent?.trim().toLowerCase();

        // Check if this text element contains 'alt'
        if (textContent === 'alt') {
          altCounter++;
          const altId = `alt-${altCounter}`;

          // Add class and data attribute to the text element
          textEl.classList.add(altTextClass);
          textEl.setAttribute('data-alt-id', altId);

          // Find the previous path sibling
          // Navigate: text -> previousSibling -> previousSibling (should be path)
          let currentNode = textEl.previousSibling;

          // Skip text nodes and whitespace
          while (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
            currentNode = currentNode.previousSibling;
          }

          // Check if we found a path element
          if (currentNode && currentNode.nodeName.toLowerCase() === 'path') {
            const pathEl = currentNode as SVGPathElement;
            pathEl.classList.add('alt-path');
            pathEl.setAttribute('data-alt-id', altId);

            console.log(`[Alt Processing] Connected alt text "${textContent}" with path using ID: ${altId}`);
          } else {
            // If immediate previous sibling is not a path, try one more level
            if (currentNode) {
              currentNode = currentNode.previousSibling;
              while (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
                currentNode = currentNode.previousSibling;
              }

              if (currentNode && currentNode.nodeName.toLowerCase() === 'path') {
                const pathEl = currentNode as SVGPathElement;
                pathEl.classList.add(altPathClass);
                pathEl.setAttribute('data-alt-id', altId);

                console.log(`[Alt Processing] Connected alt text "${textContent}" with path (2nd level) using ID: ${altId}`);
              }
            }
          }
        }
      });

      if (altCounter > 0) {
        console.log(`[Alt Processing] Processed ${altCounter} alt elements`);
      }

      bindingAltToggleEvent();
    };

    // Process after SVG content is rendered
    const timeoutId = setTimeout(processAltElements, 100);

    const bindingAltToggleEvent = () => {
      const altElements = document.querySelectorAll(`.${altTextClass},.${altPathClass}`);

      altElements.forEach((el) => {
        let altElement = el;



        if (el.tagName === 'path' && el.nextElementSibling?.nextElementSibling) {
          altElement = el.nextElementSibling?.nextElementSibling
        }

        el.removeEventListener("click", altToggleHandler)
        el.addEventListener("click", altToggleHandler)

        function altToggleHandler() {
          console.log()
          const dataIndex = altElement.getAttribute('data-alt-id');
          handleAltToggle?.(Number(dataIndex?.replace('alt-', '')));
        }

        // altElement.addEventListener('click', () => {
        //     const altId = el.getAttribute('data-alt-id');
        //     const altTexts = document.querySelectorAll(`${altTextClass}[data-alt-id="${altId}"]`);
        //     const altPaths = document.querySelectorAll(`${altPathClass}[data-alt-id="${altId}"]`);
        //     altTexts.forEach((textEl) => {
        //         textEl.classList.toggle('hidden');
        //     });
        //     altPaths.forEach((pathEl) => {
        //         pathEl.classList.toggle('hidden');
        //     });
        // });
      });
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [svgContent, contentType]);
}
