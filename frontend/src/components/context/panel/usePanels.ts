import { useContext } from "react";
import { PanelContext } from "./PanelContext.tsx";

export function usePanels() {
    const context = useContext(PanelContext);

    if (!context) {
        throw new Error("usePanels must be used inside PanelProvider");
    }

    return context;
}