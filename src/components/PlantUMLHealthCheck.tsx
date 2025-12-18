import { useEffect, useRef } from "react";
import { usePlantUMLServerStore } from "@/stores/plantumlServer";
import { Circle } from "lucide-react";

export function PlantUMLHealthCheck() {
    // console.log('PlantUMLHealthCheck mounted');
    const { serverUrl, healthStatus, checkHealth } = usePlantUMLServerStore();

    // Use ref to store the latest checkHealth function
    const checkHealthRef = useRef(checkHealth);

    // Update ref when checkHealth changes
    useEffect(() => {
        checkHealthRef.current = checkHealth;
    }, [checkHealth]);

    // Initial health check
    useEffect(() => {
        checkHealthRef.current();
    }, []); // Empty dependency array - only run once on mount

    // Poll health check every 10 seconds
    useEffect(() => {
        console.log('[PlantUMLHealthCheck] Setting up interval for health checks every 10 seconds');
        const interval = setInterval(() => {
            // console.log('[PlantUMLHealthCheck] Running health check (interval)');
            checkHealthRef.current();
        }, 10000);

        return () => {
            console.log('[PlantUMLHealthCheck] Cleaning up interval');
            clearInterval(interval);
        };
    }, []); // Empty dependency array - only set up once

    // Check health when URL changes
    useEffect(() => {
        const handleUrlChange = () => {
            console.log('[PlantUMLHealthCheck] URL changed, running health check');
            checkHealthRef.current();
        };

        window.addEventListener("plantumlServerUrlChange", handleUrlChange);
        return () => window.removeEventListener("plantumlServerUrlChange", handleUrlChange);
    }, []); // Empty dependency array - only set up once

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

    // console.log('health check')

    return (
        <div className="flex items-center gap-2 text-xs px-1 py-0.5">
            <Circle className={`h-2 w-2 fill-current animate-pulse ${getStatusColor()}`} />
            <span className="text-xs text-muted-foreground">{serverUrl}</span>
        </div>
    );
}
