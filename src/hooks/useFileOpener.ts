import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface UseFileOpenerResult {
    filePath: string | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Custom hook to handle file opening via CLI arguments
 * Listens for file-opened events and retrieves the file path from Tauri
 */
export function useFileOpener(): UseFileOpenerResult {
    const [filePath, setFilePath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const initFileOpener = async () => {
            try {
                // First, check if a file was opened via CLI
                const openedFile = await invoke<string | null>('get_opened_file_path');
                if (openedFile) {
                    console.log('[FileOpener] File opened via CLI:', openedFile);
                    setFilePath(openedFile);
                }

                // Listen for file-opened events (in case the event fires after component mount)
                unlisten = await listen<string>('file-opened', (event) => {
                    console.log('[FileOpener] File opened event received:', event.payload);
                    setFilePath(event.payload);
                });

                setIsLoading(false);
            } catch (err) {
                console.error('[FileOpener] Error:', err);
                setError(err instanceof Error ? err.message : String(err));
                setIsLoading(false);
            }
        };

        initFileOpener();

        // Cleanup listener on unmount
        return () => {
            if (unlisten) {
                unlisten();
            }
        };
    }, []);

    return { filePath, isLoading, error };
}
