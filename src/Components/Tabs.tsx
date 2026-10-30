import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "./lib/utils";

interface Tab {
    id: string;
    label: string;
}

interface TabsProps<T extends Tab> {
    label: string;
    tabs: readonly T[];
    selectedId: string;
    onSelect: (id: string) => void;
    children: ReactNode;
}

export const Tabs = <T extends Tab>({ label, tabs, selectedId, onSelect, children }: TabsProps<T>) => {
    const prefix = useId();
    const tabRefs = useRef(new Map<string, HTMLButtonElement>());
    const tabId = (id: string) => `${prefix}-tab-${id}`;
    const panelId = `${prefix}-panel`;

    const select = (id: string) => {
        onSelect(id);
        tabRefs.current.get(id)?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent, index: number) => {
        const last = tabs.length - 1;
        const target = {
            ArrowRight: index === last ? 0 : index + 1,
            ArrowLeft: index === 0 ? last : index - 1,
            Home: 0,
            End: last,
        }[event.key];
        if (target === undefined) return;
        event.preventDefault();
        select(tabs[target].id);
    };

    return (
        <div>
            <div role="tablist" aria-label={label} className="mb-8 flex flex-wrap gap-x-1 border-b border-border">
                {tabs.map((tab, index) => {
                    const isSelected = tab.id === selectedId;
                    return (
                        <button
                            key={tab.id}
                            ref={(element) => {
                                if (element) tabRefs.current.set(tab.id, element);
                                else tabRefs.current.delete(tab.id);
                            }}
                            id={tabId(tab.id)}
                            type="button"
                            role="tab"
                            aria-selected={isSelected}
                            aria-controls={panelId}
                            tabIndex={isSelected ? 0 : -1}
                            onClick={() => select(tab.id)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            className={cn(
                                "min-h-11 border-b-2 px-4 py-2 text-sm transition-colors",
                                isSelected
                                    ? "border-primary font-semibold text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            <div id={panelId} role="tabpanel" aria-labelledby={tabId(selectedId)}>
                {children}
            </div>
        </div>
    );
};
