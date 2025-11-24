import { atom, useAtom } from "jotai";

// Atom to store the current explorer root path
const explorerRootPathAtom = atom<string | null>(null);

// Hook to use the explorer root path
export function useExplorerRootPath() {
    return useAtom(explorerRootPathAtom);
}
