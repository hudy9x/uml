import { Diagnostic } from '@codemirror/lint';
import { Text } from '@codemirror/state';

/**
 * Check if a line has an empty message after colon
 * Example error: "participant -> participant:"
 */
export function checkEmptyMessage(
    line: string,
    lineNumber: number,
    doc: Text
): Diagnostic | null {
    // Check for message with colon but no text: "participant -> participant:"
    const emptyMessageRegex = /^\s*(?:\d+\s+)?["\w\s]+?\s*<?-{1,2}>?\s*["\w\s]+?\s*:\s*$/;

    if (emptyMessageRegex.test(line)) {
        const from = doc.line(lineNumber).from;
        const to = doc.line(lineNumber).to;

        return {
            from,
            to,
            severity: 'error',
            message: 'Message text is required after colon (:)',
        };
    }

    return null;
}
