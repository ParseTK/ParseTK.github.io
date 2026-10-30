import { fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";
import { useOverlay } from "./useOverlay";

interface HarnessProps {
    lockScroll?: boolean;
    startOpen?: boolean;
}

const Harness = ({ lockScroll, startOpen = true }: HarnessProps) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    const buttonRef = useRef<HTMLButtonElement>(null);
    useOverlay({ isOpen, onClose: () => setIsOpen(false), returnFocusTo: buttonRef, lockScroll });

    return (
        <div>
            <button ref={buttonRef} type="button" onClick={() => setIsOpen(true)}>
                open
            </button>
            <p>{isOpen ? "open" : "closed"}</p>
        </div>
    );
};

describe("useOverlay", () => {
    it("closes on Escape and returns focus to the chosen element", () => {
        render(<Harness />);

        fireEvent.keyDown(window, { key: "Escape" });

        expect(screen.getByText("closed")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "open" })).toHaveFocus();
    });

    it("ignores other keys", () => {
        render(<Harness />);

        fireEvent.keyDown(window, { key: "Enter" });

        expect(screen.getByText("open", { selector: "p" })).toBeInTheDocument();
    });

    it("locks page scrolling while open and restores the previous value", () => {
        document.documentElement.style.overflow = "scroll";
        render(<Harness />);

        expect(document.documentElement.style.overflow).toBe("hidden");

        fireEvent.keyDown(window, { key: "Escape" });

        expect(document.documentElement.style.overflow).toBe("scroll");
    });

    it("can leave scrolling alone", () => {
        render(<Harness lockScroll={false} />);

        expect(document.documentElement.style.overflow).toBe("");
    });

    it("does nothing while closed", () => {
        render(<Harness startOpen={false} />);

        fireEvent.keyDown(window, { key: "Escape" });

        expect(screen.getByText("closed")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "open" })).not.toHaveFocus();
        expect(document.documentElement.style.overflow).toBe("");
    });

    it("unlocks scrolling when the component goes away while open", () => {
        const { unmount } = render(<Harness />);

        unmount();

        expect(document.documentElement.style.overflow).toBe("");
    });
});
