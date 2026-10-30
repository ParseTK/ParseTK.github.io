import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useOutsidePress } from "./useOutsidePress";

const Harness = ({ enabled, onOutsidePress }: { enabled: boolean; onOutsidePress: () => void }) => {
    const insideRef = useRef<HTMLDivElement>(null);
    useOutsidePress({ enabled, insideRefs: [insideRef], onOutsidePress });
    return (
        <>
            <div ref={insideRef}>
                <button type="button">inside</button>
            </div>
            <button type="button">outside</button>
        </>
    );
};

describe("useOutsidePress", () => {
    it("calls back for a press outside the given elements", () => {
        const onOutsidePress = vi.fn();
        render(<Harness enabled onOutsidePress={onOutsidePress} />);

        fireEvent.pointerDown(screen.getByText("outside"));

        expect(onOutsidePress).toHaveBeenCalledTimes(1);
    });

    it("ignores a press inside them", () => {
        const onOutsidePress = vi.fn();
        render(<Harness enabled onOutsidePress={onOutsidePress} />);

        fireEvent.pointerDown(screen.getByText("inside"));

        expect(onOutsidePress).not.toHaveBeenCalled();
    });

    it("does nothing while disabled", () => {
        const onOutsidePress = vi.fn();
        render(<Harness enabled={false} onOutsidePress={onOutsidePress} />);

        fireEvent.pointerDown(screen.getByText("outside"));

        expect(onOutsidePress).not.toHaveBeenCalled();
    });
});
