import { useEffect, useMemo, useRef, type RefObject } from "react";
import { cn } from "../lib/utils";
import { useIsDesktop } from "../lib/useIsDesktop";
import { useOutsidePress } from "../lib/useOutsidePress";
import { useOverlay } from "../lib/useOverlay";
import { OptionGroup } from "./OptionGroup";
import { STYLE_PANEL_ID } from "./StyleButton";
import {
    ACCENTS,
    DEFAULT_SELECTION,
    MODES,
    TYPEFACES,
    accentColors,
    type Accent,
    type Mode,
    type StyleSelection,
    type Typeface,
} from "@/style/registry";
import { loadAllTypefaces, useStyleSelection } from "@/style/store";

interface StylePanelProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: RefObject<HTMLButtonElement | null>;
}

const ModePreview = ({ mode, selection }: { mode: Mode; selection: StyleSelection }) => (
    <span className={cn(mode.id, "flex items-center gap-3 rounded border border-border bg-background p-3 text-foreground")}>
        <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: accentColors(selection.accent, mode.id).color }}
        />
        <span className="flex-1 space-y-1.5" aria-hidden="true">
            <span className="block h-1.5 w-3/4 rounded-full bg-foreground/70" />
            <span className="block h-1.5 w-1/2 rounded-full bg-muted-foreground/60" />
        </span>
        <span className="text-sm font-medium">{mode.label}</span>
    </span>
);

const AccentPreview = ({ accent, modeId }: { accent: Accent; modeId: string }) => (
    <span className="flex items-center gap-2">
        <span
            aria-hidden="true"
            className="h-5 w-5 shrink-0 rounded-full border border-border"
            style={{ backgroundColor: accent.colors[modeId].color }}
        />
        <span className="text-sm font-medium">{accent.label}</span>
    </span>
);

const TypefacePreview = ({ typeface }: { typeface: Typeface }) => (
    <span className="block">
        <span className="flex items-baseline gap-3">
            <span aria-hidden="true" className="text-2xl font-semibold" style={{ fontFamily: typeface.heading }}>
                Aa
            </span>
            <span className="text-sm font-medium">{typeface.label}</span>
        </span>
        <span aria-hidden="true" className="mt-1 block text-base font-semibold" style={{ fontFamily: typeface.heading }}>
            Tyler Kirchner
        </span>
        <span aria-hidden="true" className="block text-sm text-muted-foreground" style={{ fontFamily: typeface.body }}>
            Software developer building apps, tools and games.
        </span>
    </span>
);

export const StylePanel = ({ isOpen, onClose, buttonRef }: StylePanelProps) => {
    const isDesktop = useIsDesktop();
    const panelRef = useRef<HTMLDivElement>(null);
    const [selection, update] = useStyleSelection();
    const insideRefs = useMemo(() => [panelRef, buttonRef], [buttonRef]);

    useOverlay({ isOpen, onClose, returnFocusTo: buttonRef, lockScroll: !isDesktop });
    useOutsidePress({ enabled: isOpen && isDesktop, insideRefs, onOutsidePress: onClose });

    useEffect(() => {
        if (!isOpen) return;
        panelRef.current?.focus();
        void loadAllTypefaces();
    }, [isOpen]);

    return (
        <div
            ref={panelRef}
            id={STYLE_PANEL_ID}
            role="dialog"
            aria-label="Style options"
            tabIndex={-1}
            inert={!isOpen}
            className={cn(
                "fixed inset-0 z-40 overflow-y-auto bg-background px-4 pb-8 pt-24 text-left outline-none",
                "transition-opacity duration-300",
                "md:inset-auto md:right-8 md:top-[4.5rem] md:w-96 md:max-h-[calc(100svh-6rem)] md:rounded-lg md:border md:p-5 md:shadow-lg",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            <div className="mx-auto max-w-md space-y-6 md:max-w-none">
                <OptionGroup
                    legend="Mode"
                    name="style-mode"
                    options={MODES}
                    value={selection.mode}
                    onChange={(mode) => update({ mode })}
                    className="grid-cols-2"
                    renderPreview={(mode) => <ModePreview mode={mode} selection={selection} />}
                />
                <OptionGroup
                    legend="Typeface"
                    name="style-typeface"
                    options={TYPEFACES}
                    value={selection.typeface}
                    onChange={(typeface) => update({ typeface })}
                    renderPreview={(typeface) => <TypefacePreview typeface={typeface} />}
                />
                <OptionGroup
                    legend="Accent"
                    name="style-accent"
                    options={ACCENTS}
                    value={selection.accent}
                    onChange={(accent) => update({ accent })}
                    className="grid-cols-2"
                    renderPreview={(accent) => <AccentPreview accent={accent} modeId={selection.mode} />}
                />
                <button
                    type="button"
                    onClick={() => update(DEFAULT_SELECTION)}
                    className="rounded-full border border-input px-4 py-2 text-sm hover:bg-secondary"
                >
                    Reset to defaults
                </button>
            </div>
        </div>
    );
};
