import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PanelContext, PanelName } from "./PanelContext.tsx";

export function PanelProvider({ children }: { children: ReactNode }) {
    const [activePanel, setActivePanel] = useState<PanelName>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const togglePanel = (panel: Exclude<PanelName, null>) => {
        closeSearch();
        setActivePanel(prev => prev === panel ? null : panel);
    };

    const closePanel = () => setActivePanel(null);
    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    useEffect(() => {
        if (!activePanel && !isSearchOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeSearch();
                closePanel();
            }
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [activePanel, isSearchOpen]);

    return (
        <PanelContext.Provider value={{
            activePanel,
            isSearchOpen,
            togglePanel,
            closePanel,
            openSearch,
            closeSearch
        }}>
            {children}
        </PanelContext.Provider>
    );
}