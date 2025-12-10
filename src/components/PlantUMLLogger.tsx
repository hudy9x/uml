import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

interface LogMessage {
    level: string;
    message: string;
    timestamp: string;
}

/**
 * Component that listens for PlantUML server logs from Rust backend
 * and displays them in the browser console (DevTools)
 */
export function PlantUMLLogger() {
    console.log('PlantUMLLogger mounted');
    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const initLogger = async () => {
            // Listen for plantuml-log events from Rust
            unlisten = await listen<LogMessage>('plantuml-log', (event) => {
                const { level, message, timestamp } = event.payload;

                // Log to browser console with appropriate level
                const logMessage = `[${timestamp}] ${message}`;

                switch (level) {
                    case 'error':
                        console.error(logMessage);
                        break;
                    case 'warn':
                        console.warn(logMessage);
                        break;
                    case 'info':
                    default:
                        console.log(logMessage);
                        break;
                }
            });
        };

        initLogger();

        // Cleanup listener on unmount
        return () => {
            if (unlisten) {
                unlisten();
            }
        };
    }, []);

    return null; // This component doesn't render anything
}
