import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface UseFileOpenerResult {
    filePath: string | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Custom hook to handle file opening via "Open With" functionality
 * Works on both Windows and macOS by checking CLI arguments and listening for events
 */
export function useFileOpener(): UseFileOpenerResult {
    const [filePath, setFilePath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const initFileOpener = async () => {
            try {
                // Check if a file was opened via "Open With" (works for both Windows and macOS)
                const openedFile = await invoke<string | null>('get_opened_file_path');

                if (openedFile) {
                    console.log('[useFileOpener] ✅ File opened:', openedFile);
                    setFilePath(openedFile);
                }

                // Listen for file-opened events (for files opened while app is running)
                unlisten = await listen<string>('file-opened', (event) => {
                    console.log('[useFileOpener] 🎉 File-opened event:', event.payload);
                    setFilePath(event.payload);
                });

                setIsLoading(false);
            } catch (err) {
                console.error('[useFileOpener] ❌ Error:', err);
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
