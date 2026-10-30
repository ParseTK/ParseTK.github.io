import { useCallback, useSyncExternalStore } from "react";
import {
    DEFAULT_SELECTION,
    MODES,
    TYPEFACES,
    findOption,
    normalizeSelection,
    resolveStyle,
    type StyleSelection,
} from "./registry";

export const STORAGE_KEY = "style";

const listeners = new Set<() => void>();
const loadedTypefaces = new Map<string, Promise<unknown>>();

let memoryCopy: string | null = null;
let cachedRaw: string | null | undefined;
let cachedSelection: StyleSelection = DEFAULT_SELECTION;

const readRaw = (): string | null => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return memoryCopy;
    }
};

const parse = (raw: string | null): StyleSelection => {
    if (!raw) return DEFAULT_SELECTION;
    try {
        return normalizeSelection((JSON.parse(raw) as { selection?: Partial<StyleSelection> }).selection);
    } catch {
        return DEFAULT_SELECTION;
    }
};

export const getSelection = (): StyleSelection => {
    const raw = readRaw();
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedSelection = parse(raw);
    }
    return cachedSelection;
};

export const loadTypeface = (id: string): Promise<unknown> => {
    const typeface = findOption(TYPEFACES, id);
    if (!typeface) return Promise.resolve();
    let loading = loadedTypefaces.get(id);
    if (!loading) {
        loading = typeface.load().catch(() => loadedTypefaces.delete(id));
        loadedTypefaces.set(id, loading);
    }
    return loading;
};

export const loadAllTypefaces = () => Promise.all(TYPEFACES.map((typeface) => loadTypeface(typeface.id)));

const applyToDocument = (selection: StyleSelection) => {
    const { modeClass, themeColor, vars } = resolveStyle(selection);
    const root = document.documentElement;

    // Switching colors with transitions running makes different parts of the page lag behind each other
    root.classList.add("theme-switching");
    for (const mode of MODES) root.classList.toggle(mode.id, mode.id === modeClass);
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
    root.getBoundingClientRect();
    root.classList.remove("theme-switching");
    document.querySelector("meta[name=theme-color]")?.setAttribute("content", themeColor);

    void loadTypeface(selection.typeface);
};

export const initStyle = () => applyToDocument(getSelection());

export const setSelection = (patch: Partial<StyleSelection>) => {
    const next = normalizeSelection({ ...getSelection(), ...patch });
    const raw = JSON.stringify({ selection: next, resolved: resolveStyle(next) });

    memoryCopy = raw;
    try {
        localStorage.setItem(STORAGE_KEY, raw);
    } catch {
        // storage unavailable: the choice lasts until the page closes
    }
    applyToDocument(next);
    listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const useStyleSelection = () => {
    const selection = useSyncExternalStore(subscribe, getSelection);
    const update = useCallback((patch: Partial<StyleSelection>) => setSelection(patch), []);
    return [selection, update] as const;
};
