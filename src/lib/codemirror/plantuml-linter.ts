import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';

/**
 * Lint PlantUML code and return diagnostics for syntax errors
 */
export function lintPlantUML(view: EditorView): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const doc = view.state.doc;
    const lines = doc.toString().split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Skip empty lines, comments, and directives
        if (
            !trimmedLine ||
            trimmedLine.startsWith("'") ||
            trimmedLine.startsWith("@") ||
            trimmedLine.startsWith("==") ||
            trimmedLine.startsWith("title") ||
            trimmedLine.startsWith("participant") ||
            trimmedLine.startsWith("autonumber") ||
            trimmedLine.startsWith("activate") ||
            trimmedLine.startsWith("deactivate") ||
            trimmedLine.startsWith("note") ||
            trimmedLine.startsWith("end note")
        ) {
            continue;
        }

        // Check for message with colon but no text: "participant -> participant:"
        const emptyMessageRegex = /^\s*(?:\d+\s+)?["\w\s]+?\s*<?-{1,2}>?\s*["\w\s]+?\s*:\s*$/;
        if (emptyMessageRegex.test(line)) {
            const from = doc.line(i + 1).from;
            const to = doc.line(i + 1).to;

            diagnostics.push({
                from,
                to,
                severity: 'error',
                message: 'Message text is required after colon (:)',
            });
        }

        // Check for invalid arrow syntax
        const invalidArrowRegex = /^\s*["\w\s]+?\s*[-=]{3,}\s*["\w\s]+/;
        if (invalidArrowRegex.test(line) && !line.includes('->') && !line.includes('<-')) {
            const from = doc.line(i + 1).from;
            const to = doc.line(i + 1).to;

            diagnostics.push({
                from,
                to,
                severity: 'error',
                message: 'Invalid arrow syntax. Use ->, -->, <-, or <--',
            });
        }
    }

    return diagnostics;
}
