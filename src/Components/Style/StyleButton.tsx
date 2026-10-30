import type { RefObject } from "react";
import { Palette } from "lucide-react";

interface StyleButtonProps {
    isOpen: boolean;
    onClick: () => void;
    buttonRef: RefObject<HTMLButtonElement | null>;
}

export const STYLE_PANEL_ID = "style-panel";

export const StyleButton = ({ isOpen, onClick, buttonRef }: StyleButtonProps) => (
    <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        aria-label="Style options"
        aria-expanded={isOpen}
        aria-controls={STYLE_PANEL_ID}
        className="p-2.5 rounded-full border border-input bg-card transition-colors duration-300 hover:bg-secondary"
    >
        <Palette className="h-6 w-6 text-primary" aria-hidden="true" />
    </button>
);
