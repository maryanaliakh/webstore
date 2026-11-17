import { createContext } from "react";

export type PanelName = "women" | "men" | "filters" | "shipping" | "discount" | null;

interface PanelContextType {
    activePanel: PanelName;
    isSearchOpen: boolean;
    togglePanel: (panel: Exclude<PanelName, null>) => void;
    closePanel: () => void;
    openSearch: () => void;
    closeSearch: () => void;
}

export const PanelContext = createContext<PanelContextType | null>(null);