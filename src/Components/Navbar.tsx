import { useEffect, useState } from "react";
import { cn } from "./lib/utils";
import { Menu, X } from "lucide-react";

const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
]

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll);
        return () =>
            window.removeEventListener("scroll", handleScroll);
    }, []);

    // Escape closes the mobile menu
    useEffect(() => {
        if (!isMenuOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsMenuOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

    return (
        <nav
            aria-label="Primary"
            className={cn(
                "fixed w-full z-40 transition-all duration-300",
                isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5"
            )}
        >
            <div className="container flex items-center justify-between">
                <a
                    className="text-xl font-bold text-primary flex items-center"
                    href="#hero"
                >
                    <span className="relative z-10">
                        <span className="text-glow text-foreground"> ParseTK </span> Portfolio
                    </span>
                </a>
                {/* Desktop nav items */}
                {/* right margin leaves room for the fixed theme toggle */}
                <div className="hidden md:flex space-x-8 ml-6 mr-14">
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

                {/* Mobile nav items */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="md:hidden p-2 text-foreground z-50"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                >
                    {isMenuOpen
                        ? <X size={24} aria-hidden="true" />
                        : <Menu size={24} aria-hidden="true" />}
                </button>

                {/* inert keeps the closed menu out of the tab order and the accessibility tree */}
                <div
                    id="mobile-menu"
                    inert={!isMenuOpen}
                    className={cn(
                        "fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center",
                        "transition-all duration-300 md:hidden",
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
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};
