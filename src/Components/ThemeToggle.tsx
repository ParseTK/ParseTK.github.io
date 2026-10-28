import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from './lib/utils';

export const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        // Dark is the default; light only when the visitor chose it
        let storedTheme: string | null = null;
        try {
            storedTheme = localStorage.getItem("theme");
        } catch {
            // storage can be blocked; fall back to the default
        }
        const dark = storedTheme !== "light";
        document.documentElement.classList.toggle('dark', dark);
        setIsDarkMode(dark);
    }, []);

    const toggleTheme = () => {
        const next = !isDarkMode;
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            // the choice still applies for this visit
        }
        setIsDarkMode(next);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className={cn(
                // bottom-right below md so it never covers the menu button; top-right beside the nav links from md up
                "fixed bottom-4 right-4 md:bottom-auto md:top-3 md:right-3 z-50",
                "p-2.5 rounded-full border border-input bg-card shadow-xs transition-colors duration-300",
                "hover:bg-secondary"
            )}
        >
            {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-300" aria-hidden="true" />
            ) : (
                <Moon className="h-6 w-6 text-blue-900" aria-hidden="true" />
            )}
        </button>
    );
};
