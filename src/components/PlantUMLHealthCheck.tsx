import { useEffect } from "react";
import { usePlantUMLServerStore } from "@/stores/plantumlServer";
import { Circle } from "lucide-react";

export function PlantUMLHealthCheck() {
    const { serverUrl, healthStatus, checkHealth } = usePlantUMLServerStore();

    // Initial health check
    useEffect(() => {
        checkHealth();
    }, [checkHealth]);

    // Poll health check every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            checkHealth();
        }, 10000);

        return () => clearInterval(interval);
    }, [checkHealth]);

    // Check health when URL changes
    useEffect(() => {
        const handleUrlChange = () => {
            checkHealth();
        };

        window.addEventListener("plantumlServerUrlChange", handleUrlChange);
        return () => window.removeEventListener("plantumlServerUrlChange", handleUrlChange);
    }, [checkHealth]);

    const getStatusColor = () => {
        switch (healthStatus) {
            case "healthy":
                return "text-green-500";
            case "unhealthy":
                return "text-red-500";
            case "checking":
                return "text-gray-400";
        }
    };

    return (
        <div className="flex items-center gap-2 text-xs px-1 py-0.5">
            <Circle className={`h-2 w-2 fill-current animate-pulse ${getStatusColor()}`} />
            <span className="text-xs text-muted-foreground">{serverUrl}</span>
        </div>
    );
}
