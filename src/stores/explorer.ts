import { atom, useAtom } from "jotai";

// Atom to store the current explorer root path
const explorerRootPathAtom = atom<string | null>(null);

// Hook to use the explorer root path
export function useExplorerRootPath() {
    return useAtom(explorerRootPathAtom);
}

// Atom to trigger explorer reload (increment to trigger)
const explorerReloadTriggerAtom = atom<number>(0);

// Hook to trigger explorer reload
export function useExplorerReloadTrigger() {
    return useAtom(explorerReloadTriggerAtom);
}
