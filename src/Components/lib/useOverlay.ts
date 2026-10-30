import { useEffect, type RefObject } from "react";

interface UseOverlayOptions {
    isOpen: boolean;
    onClose: () => void;
    returnFocusTo?: RefObject<HTMLElement | null>;
    lockScroll?: boolean;
}

export const useOverlay = ({ isOpen, onClose, returnFocusTo, lockScroll = true }: UseOverlayOptions) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            onClose();
            returnFocusTo?.current?.focus();
        };
        window.addEventListener("keydown", handleKeyDown);

        const root = document.documentElement;
        const previousOverflow = root.style.overflow;
        if (lockScroll) root.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (lockScroll) root.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose, returnFocusTo, lockScroll]);
};
