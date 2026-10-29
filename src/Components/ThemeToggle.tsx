import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        let storedTheme: string | null = null;
        try {
            storedTheme = localStorage.getItem("theme");
        } catch {
            // storage unavailable
        }
        const dark = storedTheme !== "light";
        document.documentElement.classList.toggle('dark', dark);
        setIsDarkMode(dark);
    }, []);

    const toggleTheme = () => {
        const next = !isDarkMode;
        const root = document.documentElement;
        root.classList.add('theme-switching');
        root.classList.toggle('dark', next);
        root.getBoundingClientRect();
        root.classList.remove('theme-switching');
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            // storage unavailable
        }
        setIsDarkMode(next);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2.5 rounded-full border border-input bg-card transition-colors duration-300 hover:bg-secondary"
        >
            {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-300" aria-hidden="true" />
            ) : (
                <Moon className="h-6 w-6 text-blue-900" aria-hidden="true" />
            )}
        </button>
    );
};
