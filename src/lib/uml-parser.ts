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
 * Find the line number for a message based on its text and participants
 * Returns the first matching line number, or null if not found
 */
export function findMessageLine(
    messages: UMLMessage[],
    messageText: string,
    fromParticipant?: string,
    toParticipant?: string
): number | null {
    // Try to find exact match with participants if provided
    if (fromParticipant && toParticipant) {
        const exactMatch = messages.find(
            (msg) =>
                msg.text === messageText &&
                msg.from.toLowerCase() === fromParticipant.toLowerCase() &&
                msg.to.toLowerCase() === toParticipant.toLowerCase()
        );
        if (exactMatch) return exactMatch.lineNumber;
    }

    // Try to find match with just message text
    const textMatch = messages.find((msg) => msg.text === messageText);
    if (textMatch) return textMatch.lineNumber;

    // Try partial match (in case of truncated text in SVG)
    const partialMatch = messages.find((msg) =>
        msg.text.includes(messageText) || messageText.includes(msg.text)
    );
    if (partialMatch) return partialMatch.lineNumber;

    return null;
}
