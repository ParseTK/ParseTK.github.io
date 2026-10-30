export interface Option {
    id: string;
    label: string;
}

export interface Mode extends Option {
    colorScheme: "light" | "dark";
    // "r, g, b" for the background stars, or null for a mode that shows none
    starColor: string | null;
    // The page background as a hex colour, for the browser bar on phones
    themeColor: string;
}

export interface AccentColors {
    color: string;
    onColor: string;
}

export interface Accent extends Option {
    colors: Record<Mode["id"], AccentColors>;
}

export interface Typeface extends Option {
    heading: string;
    body: string;
    load: () => Promise<unknown>;
}

export interface StyleSelection {
    mode: string;
    typeface: string;
    accent: string;
}

const SANS_FALLBACK = "ui-sans-serif, system-ui, sans-serif";

export const MODES: readonly Mode[] = [
    { id: "dark", label: "Dark", colorScheme: "dark", starColor: "255, 255, 255", themeColor: "#05080f" },
    { id: "light", label: "Light", colorScheme: "light", starColor: null, themeColor: "#f8fafc" },
];

export const TYPEFACES: readonly Typeface[] = [
    {
        id: "grotesk",
        label: "Grotesk",
        heading: `"Space Grotesk Variable", ${SANS_FALLBACK}`,
        body: `"Inter Variable", ${SANS_FALLBACK}`,
        load: () => Promise.all([import("@fontsource-variable/space-grotesk"), import("@fontsource-variable/inter")]),
    },
    {
        id: "geometric",
        label: "Geometric",
        heading: `"Sora Variable", ${SANS_FALLBACK}`,
        body: `"DM Sans Variable", ${SANS_FALLBACK}`,
        load: () => Promise.all([import("@fontsource-variable/sora"), import("@fontsource-variable/dm-sans")]),
    },
];

export const ACCENTS: readonly Accent[] = [
    {
        id: "orange",
        label: "Orange",
        colors: {
            dark: { color: "#f47b25", onColor: "#06080d" },
            light: { color: "#b83f0a", onColor: "#ffffff" },
        },
    },
    {
        id: "ice",
        label: "Ice",
        colors: {
            dark: { color: "#5cc8ff", onColor: "#06080d" },
            light: { color: "#0369a1", onColor: "#ffffff" },
        },
    },
    {
        id: "violet",
        label: "Violet",
        colors: {
            dark: { color: "#a78bfa", onColor: "#06080d" },
            light: { color: "#6d28d9", onColor: "#ffffff" },
        },
    },
    {
        id: "mint",
        label: "Mint",
        colors: {
            dark: { color: "#4ade9c", onColor: "#06080d" },
            light: { color: "#047857", onColor: "#ffffff" },
        },
    },
];

export const DEFAULT_SELECTION: StyleSelection = {
    mode: "dark",
    typeface: "grotesk",
    accent: "orange",
};

export const findOption = <T extends Option>(options: readonly T[], id: string): T | undefined =>
    options.find((option) => option.id === id);

const requireOption = <T extends Option>(options: readonly T[], id: string): T => {
    const option = findOption(options, id);
    if (!option) throw new Error(`Unknown style option: ${id}`);
    return option;
};

export const accentColors = (accentId: string, modeId: string): AccentColors =>
    requireOption(ACCENTS, accentId).colors[modeId];

export interface ResolvedStyle {
    modeClass: string;
    themeColor: string;
    vars: Record<string, string>;
}

export const resolveStyle = (selection: StyleSelection): ResolvedStyle => {
    const mode = requireOption(MODES, selection.mode);
    const typeface = requireOption(TYPEFACES, selection.typeface);
    const { color, onColor } = accentColors(selection.accent, mode.id);

    return {
        modeClass: mode.id,
        themeColor: mode.themeColor,
        vars: {
            "--primary": color,
            "--primary-foreground": onColor,
            "--style-font-heading": typeface.heading,
            "--style-font-body": typeface.body,
        },
    };
};

export const normalizeSelection = (value: Partial<StyleSelection> | null | undefined): StyleSelection => ({
    mode: findOption(MODES, value?.mode ?? "")?.id ?? DEFAULT_SELECTION.mode,
    typeface: findOption(TYPEFACES, value?.typeface ?? "")?.id ?? DEFAULT_SELECTION.typeface,
    accent: findOption(ACCENTS, value?.accent ?? "")?.id ?? DEFAULT_SELECTION.accent,
});
