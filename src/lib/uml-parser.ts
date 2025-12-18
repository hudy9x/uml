// Regex pattern parts for PlantUML message syntax
// Participant can be either:
// 1. Quoted: "Something new" - can contain letters, numbers, spaces, underscores, hyphens inside quotes
// 2. Unquoted: Foo123 - can only contain letters, numbers, underscores (no spaces)
const QUOTED_PARTICIPANT = '"[a-zA-Z0-9_\\s-]+"';
const UNQUOTED_PARTICIPANT = '[a-zA-Z0-9_]+';
const PARTICIPANT_PATTERN = `(?:${QUOTED_PARTICIPANT}|${UNQUOTED_PARTICIPANT})`;

// Arrow types: add or modify arrow types here as needed
// Order matters: longer patterns should come first (e.g., -->x before -->)
const ARROW_PATTERN = '->x|-->x|->|-->|<-x|<--x|<-|<--';

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

    // Build the complete message regex from pattern parts
    // Format: [optional line number] participant-1 arrow participant-2 : message
    // Example: "23 Bob -> Alice : hello"
    const messageRegex = new RegExp(
        `^\\s*(${PARTICIPANT_PATTERN})\\s*(${ARROW_PATTERN})\\s*(${PARTICIPANT_PATTERN})\\s*:\\s*(.+)$`
    );

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

    // Build the complete message regex from pattern parts
    // Format: [optional line number] participant-1 arrow participant-2 [optional: message]
    // Example: "Bob -> Alice" or "23 Bob -> Alice : hello"
    const messageRegex = new RegExp(
        `^\\s*(?:\\d+\\s+)?(${PARTICIPANT_PATTERN})\\s*(${ARROW_PATTERN})\\s*(${PARTICIPANT_PATTERN})(?:\\s*:\\s*.+)?$`
    );

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
