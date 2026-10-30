import { useEffect, type RefObject } from "react";

interface UseOutsidePressOptions {
    enabled: boolean;
    insideRefs: RefObject<HTMLElement | null>[];
    onOutsidePress: () => void;
}

export const useOutsidePress = ({ enabled, insideRefs, onOutsidePress }: UseOutsidePressOptions) => {
    useEffect(() => {
        if (!enabled) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (insideRefs.some((ref) => ref.current?.contains(target))) return;
            onOutsidePress();
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [enabled, insideRefs, onOutsidePress]);
};
