import { useCallback, useEffect, useRef } from "react";
import { cn } from "./lib/utils";
import { useIsDesktop } from "./lib/useIsDesktop";
import { useOverlay } from "./lib/useOverlay";
import { useScrolledPast } from "./lib/useScrolledPast";
import { StyleButton } from "./Style/StyleButton";
import { StylePanel } from "./Style/StylePanel";
import { Menu, X } from "lucide-react";
import { SECTIONS } from "@/data/sections";

const navItems = SECTIONS.map(({ id, label }) => ({ name: label, href: `#${id}` }));

export type OverlayName = "menu" | "style";

interface NavbarProps {
    openOverlay: OverlayName | null;
    onOpenOverlayChange: (overlay: OverlayName | null) => void;
}

export const Navbar = ({ openOverlay, onOpenOverlayChange }: NavbarProps) => {
    const isScrolled = useScrolledPast(10);
    const isDesktop = useIsDesktop();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const styleButtonRef = useRef<HTMLButtonElement>(null);
    const isMenuOpen = openOverlay === "menu";
    const isStyleOpen = openOverlay === "style";

    useEffect(() => {
        if (isDesktop && openOverlay === "menu") onOpenOverlayChange(null);
    }, [isDesktop, openOverlay, onOpenOverlayChange]);

    const closeOverlay = useCallback(() => onOpenOverlayChange(null), [onOpenOverlayChange]);
    useOverlay({ isOpen: isMenuOpen, onClose: closeOverlay, returnFocusTo: menuButtonRef });

    return (
        <>
            <nav
                aria-label="Primary"
                className={cn(
                    "fixed w-full z-50 transition-all duration-300",
                    isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5",
                )}
            >
                <div className="flex items-center justify-between px-4 md:px-8">
                    <a className="text-xl font-bold text-primary flex items-center" href="#hero">
                        <span className="relative z-10">
                            <span className="text-glow text-foreground"> ParseTK </span> Portfolio
                        </span>
                    </a>

                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="hidden md:flex space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-foreground/80 hover:text-primary transition-colors duration-300"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        <StyleButton
                            buttonRef={styleButtonRef}
                            isOpen={isStyleOpen}
                            onClick={() => onOpenOverlayChange(isStyleOpen ? null : "style")}
                        />

                        <button
                            ref={menuButtonRef}
                            type="button"
                            onClick={() => onOpenOverlayChange(isMenuOpen ? null : "menu")}
                            className="md:hidden p-2.5 text-foreground"
                            aria-label="Site menu"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Outside the nav on purpose: the nav's backdrop-blur would shrink a fixed child to the nav's height */}
            <nav
                id="mobile-menu"
                aria-label="Mobile"
                inert={!isMenuOpen}
                className={cn(
                    "fixed inset-0 z-40 flex flex-col items-center justify-center bg-background",
                    "transition-opacity duration-300 md:hidden",
                    isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                )}
            >
                <div className="flex flex-col space-y-8 text-xl">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-foreground/80 hover:text-primary transition-colors duration-300"
                            onClick={closeOverlay}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </nav>

            <StylePanel isOpen={isStyleOpen} onClose={closeOverlay} buttonRef={styleButtonRef} />
        </>
    );
};
