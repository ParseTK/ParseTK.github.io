import { useEffect, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "./lib/utils";

interface TooltipProps {
    label: string;
    children: ReactNode;
    placement?: "top" | "bottom";
    // "end" lines the tooltip up with the right edge of the control, for controls at the edge of the screen
    align?: "center" | "end";
    className?: string;
}

const isKeyboardFocus = (event: FocusEvent) => {
    try {
        return event.target.matches(":focus-visible");
    } catch {
        return true;
    }
};

// A small label for a control that has only an icon. It is only for the eye: the control already has an
// accessible name, so the label is hidden from screen readers rather than read twice. It shows on mouse hover
// and keyboard focus (not on touch, which has no hover), stays while the pointer moves onto it, and Escape hides it.
export const Tooltip = ({ label, children, placement = "top", align = "center", className }: TooltipProps) => {
    const [open, setOpen] = useState(false);

    const handlePointerEnter = (event: PointerEvent) => {
        if (event.pointerType === "mouse") setOpen(true);
    };

    // While a label is showing, Escape dismisses it wherever the keyboard focus is (a label opened by the mouse
    // leaves focus elsewhere). It is caught first and stopped, so that same Escape does not also close a panel.
    useEffect(() => {
        if (!open) return;
        const dismiss = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            event.stopPropagation();
            setOpen(false);
        };
        window.addEventListener("keydown", dismiss, true);
        return () => window.removeEventListener("keydown", dismiss, true);
    }, [open]);

    return (
        <span
            className={cn("relative inline-flex", className)}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={() => setOpen(false)}
            onFocus={(event) => isKeyboardFocus(event) && setOpen(true)}
            onBlur={() => setOpen(false)}
        >
            {children}
            {/* The padding on the side facing the control bridges the gap, so moving the pointer onto the label does not close it */}
            <span
                aria-hidden="true"
                data-tooltip
                className={cn(
                    "pointer-events-none absolute z-50 transition-opacity duration-150",
                    placement === "top" ? "bottom-full pb-2" : "top-full pt-2",
                    align === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
                    open ? "pointer-events-auto visible opacity-100" : "invisible opacity-0",
                )}
            >
                <span className="block whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground shadow-md">
                    {label}
                </span>
            </span>
        </span>
    );
};
