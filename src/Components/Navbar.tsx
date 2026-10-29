import { useEffect, useRef } from "react";
import { cn } from "./lib/utils";
import { useMediaQuery } from "./lib/useMediaQuery";
import { useScrolledPast } from "./lib/useScrolledPast";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";

const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
]

interface NavbarProps {
    isMenuOpen: boolean;
    onMenuOpenChange: (open: boolean) => void;
}

export const Navbar = ({ isMenuOpen, onMenuOpenChange }: NavbarProps) => {
    const isScrolled = useScrolledPast(10);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isDesktop) onMenuOpenChange(false);
    }, [isDesktop, onMenuOpenChange]);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            onMenuOpenChange(false);
            menuButtonRef.current?.focus();
        };
        window.addEventListener("keydown", handleKeyDown);

        const previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.documentElement.style.overflow = previousOverflow;
        };
    }, [isMenuOpen, onMenuOpenChange]);

    return (
        <>
            <nav
                aria-label="Primary"
                className={cn(
                    "fixed w-full z-50 transition-all duration-300",
                    isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5"
                )}
            >
                <div className="flex items-center justify-between px-4 md:px-8">
                    <a
                        className="text-xl font-bold text-primary flex items-center"
                        href="#hero"
                    >
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

                        <ThemeToggle />

                        <button
                            ref={menuButtonRef}
                            type="button"
                            onClick={() => onMenuOpenChange(!isMenuOpen)}
                            className="md:hidden p-2.5 text-foreground"
                            aria-label="Site menu"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {isMenuOpen
                                ? <X size={24} aria-hidden="true" />
                                : <Menu size={24} aria-hidden="true" />}
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
                    isMenuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
            >
                <div className="flex flex-col space-y-8 text-xl">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-foreground/80 hover:text-primary transition-colors duration-300"
                            onClick={() => onMenuOpenChange(false)}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </nav>
        </>
    );
};
