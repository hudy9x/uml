import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileOpener } from '../hooks/useFileOpener';

/**
 * Component that listens for file-opened events and navigates to the file viewer
 * This should be mounted in the main App component
 */
export function FileAssociationHandler() {
    const navigate = useNavigate();
    const { filePath, isLoading } = useFileOpener();

    useEffect(() => {
        // Only navigate if we have a file path and we're not already on the file-viewer route
        if (filePath && !isLoading && window.location.pathname !== '/file-viewer') {
            console.log('[FileAssociationHandler] Navigating to file-viewer with file:', filePath);
            navigate('/file-viewer');
        }
    }, [filePath, isLoading, navigate]);

    return null; // This component doesn't render anything
}
