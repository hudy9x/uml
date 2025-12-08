import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const DEFAULT_PLANTUML_SERVER_URL = "http://localhost:8080/plantuml";

export type HealthStatus = "healthy" | "unhealthy" | "checking";

interface PlantUMLServerState {
    serverUrl: string;
    healthStatus: HealthStatus;
    setServerUrl: (url: string) => void;
    checkHealth: () => Promise<void>;
}

// Atom with localStorage persistence
const serverUrlAtom = atomWithStorage(
    "plantumlServerUrl",
    DEFAULT_PLANTUML_SERVER_URL
);

// Health status atom
const healthStatusAtom = atom<HealthStatus>("checking");

// Action atom to check server health
const checkHealthAtom = atom(null, async (get, set) => {
    const serverUrl = get(serverUrlAtom);
    set(healthStatusAtom, "checking");

    try {
        // Try to fetch a simple test diagram to verify server is working
        const testDiagram = "SyfFKj2rKt3CoKnELR1Io4ZDoSa70000"; // Simple "Bob -> Alice" diagram
        const response = await fetch(`${serverUrl}/svg/${testDiagram}`, {
            method: "GET",
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (response.ok) {
            set(healthStatusAtom, "healthy");
        } else {
            set(healthStatusAtom, "unhealthy");
        }
    } catch (error) {
        console.error("PlantUML server health check failed:", error);
        set(healthStatusAtom, "unhealthy");
    }
});

// Action atom to set server URL
const setServerUrlAtom = atom(null, (_get, set, url: string) => {
    set(serverUrlAtom, url);
    // Trigger health check when URL changes
    set(checkHealthAtom);
});

// Hook to use the store - overloaded for proper typing
export function usePlantUMLServerStore(): PlantUMLServerState;
export function usePlantUMLServerStore<T>(selector: (state: PlantUMLServerState) => T): T;
export function usePlantUMLServerStore<T>(
    selector?: (state: PlantUMLServerState) => T
): T | PlantUMLServerState {
    const [serverUrl] = useAtom(serverUrlAtom);
    const [healthStatus] = useAtom(healthStatusAtom);
    const [, setServerUrl] = useAtom(setServerUrlAtom);
    const [, checkHealth] = useAtom(checkHealthAtom);

    const store: PlantUMLServerState = {
        serverUrl,
        healthStatus,
        setServerUrl: (url) => setServerUrl(url),
        checkHealth: async () => checkHealth(),
    };

    return selector ? selector(store) : store;
}

// Convenience hooks
export function usePlantUMLServerUrl(): string {
    return usePlantUMLServerStore((state) => state.serverUrl);
}

export function usePlantUMLHealthStatus(): HealthStatus {
    return usePlantUMLServerStore((state) => state.healthStatus);
}
