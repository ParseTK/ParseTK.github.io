import { act } from "@testing-library/react";

const DEFAULT_WIDTH = 1280;

let width = DEFAULT_WIDTH;
const subscribers = new Map<() => void, { query: string; last: boolean }>();

const matches = (query: string): boolean => {
    const min = query.match(/\(min-width:\s*(\d+)px\)/);
    if (min) return width >= Number(min[1]);
    const max = query.match(/\(max-width:\s*(\d+)px\)/);
    if (max) return width <= Number(max[1]);
    return false;
};

export const installMatchMedia = () => {
    window.matchMedia = (query: string) =>
        ({
            matches: matches(query),
            media: query,
            onchange: null,
            addEventListener: (_type: string, callback: () => void) => {
                subscribers.set(callback, { query, last: matches(query) });
            },
            removeEventListener: (_type: string, callback: () => void) => {
                subscribers.delete(callback);
            },
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        }) as unknown as MediaQueryList;
};

export const setViewportWidth = (next: number) => {
    width = next;
    Object.defineProperty(window, "innerWidth", { value: next, configurable: true, writable: true });
    act(() => {
        subscribers.forEach((state, callback) => {
            const now = matches(state.query);
            if (now !== state.last) {
                state.last = now;
                callback();
            }
        });
    });
};

export const resetViewport = () => {
    subscribers.clear();
    width = DEFAULT_WIDTH;
    Object.defineProperty(window, "innerWidth", { value: DEFAULT_WIDTH, configurable: true, writable: true });
};

export const setScrollY = (value: number) => {
    Object.defineProperty(window, "scrollY", { value, configurable: true, writable: true });
    act(() => {
        window.dispatchEvent(new Event("scroll"));
    });
};
