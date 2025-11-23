/**
 * Represents a message in a UML diagram
 */
export interface UMLMessage {
    from: string;
    to: string;
    text: string;
    lineNumber: number;
    arrowType: string;
}

/**
 * Parse PlantUML code and extract message information with line numbers
 */
export function parseUMLMessages(umlCode: string): UMLMessage[] {
    const lines = umlCode.split('\n');
    const messages: UMLMessage[] = [];

    // Regular expression to match PlantUML message syntax
    // Matches: participant -> participant: message
    // Supports: ->, -->, <-, <--, ->, etc.
    // Supports quoted participant names like "Web App"
    const messageRegex = /^\s*(?:(\d+)\s+)?(["\w\s]+?)\s*(<?-{1,2}>?)\s*(["\w\s]+?)\s*:\s*(.+)$/;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Skip comments, empty lines, and PlantUML directives
        if (
            !trimmedLine ||
            trimmedLine.startsWith("'") ||
            trimmedLine.startsWith("@") ||
            trimmedLine.startsWith("==") ||
            trimmedLine.startsWith("title") ||
            trimmedLine.startsWith("participant") ||
            trimmedLine.startsWith("autonumber") ||
            trimmedLine.startsWith("activate") ||
            trimmedLine.startsWith("deactivate")
        ) {
            return;
        }

        const match = line.match(messageRegex);
        if (match) {
            const [, , from, arrowType, to, text] = match;

            messages.push({
                from: from.replace(/"/g, '').trim(),
                to: to.replace(/"/g, '').trim(),
                text: text.trim(),
                lineNumber: index + 1, // 1-indexed line numbers
                arrowType: arrowType.trim(),
            });
        }
    });

    return messages;
}

/**
 * Find the line number for a message based on SVG message index
 * Scans the UML code line by line to find the Nth message occurrence
 */
export function findMessageLine(
    svgMessageIndex: number,
    umlCode: string
): number | null {
    const lines = umlCode.split('\n');

    // Regular expression to match PlantUML message syntax
    // Matches: participant -> participant: message
    // Also matches: participant -> participant (without message)
    // Supports: ->, -->, <-, <--, etc.
    const messageRegex = /^\s*(?:\d+\s+)?["\w\s]+?\s*<?-{1,2}>?\s*["\w\s]+?(?:\s*:\s*.+)?$/;

    let messageCount = 0;

    console.log("lines", lines)

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip comments, empty lines, and PlantUML directives
        if (
            !line ||
            line.startsWith("'") ||
            line.startsWith("@") ||
            line.startsWith("==") ||
            line.startsWith("title") ||
            line.startsWith("participant") ||
            line.startsWith("autonumber") ||
            line.startsWith("activate") ||
            line.startsWith("deactivate") ||
            line.startsWith("note")
        ) {
            continue;
        }

        // Check if this line matches message syntax
        if (messageRegex.test(line)) {
            console.log(i, `Found message: ${line}`, svgMessageIndex, messageCount);
            // If this is the message we're looking for
            if (messageCount === svgMessageIndex) {
                console.log("result", i + 1)
                return i + 1; // Return 1-indexed line number
            }
            messageCount++;
        }
    }

    return null;
}
