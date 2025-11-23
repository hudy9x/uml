import { Diagnostic } from '@codemirror/lint';
import { Text } from '@codemirror/state';

/**
 * Check if a line has invalid arrow syntax
 * Example error: "participant --- participant" (should use -> or -->)
 */
export function checkInvalidArrow(
    line: string,
    lineNumber: number,
    doc: Text
): Diagnostic | null {
    // Check for invalid arrow syntax
    const invalidArrowRegex = /^\s*["\w\s]+?\s*[-=]{3,}\s*["\w\s]+/;

    if (invalidArrowRegex.test(line) && !line.includes('->') && !line.includes('<-')) {
        const from = doc.line(lineNumber).from;
        const to = doc.line(lineNumber).to;

        return {
            from,
            to,
            severity: 'error',
            message: 'Invalid arrow syntax. Use ->, -->, <-, or <--',
        };
    }

    return null;
}
