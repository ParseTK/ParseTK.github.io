import { cn } from "./lib/utils";
import { STATUS_LABEL, type TimelineItem } from "@/data/timeline";

// The marker and the line are positioned from the middle of the same column, so they stay centred on each other
const CENTRED = "absolute left-1/2 -translate-x-1/2";

const Marker = ({ status, isLast }: { status: TimelineItem["status"]; isLast: boolean }) => (
    <div aria-hidden="true" className="relative">
        <span
            data-marker
            className={cn(
                CENTRED,
                "top-1.5 z-1 size-3 overflow-hidden rounded-full border-2 border-primary bg-background",
            )}
        >
            <span data-status={status} className="marker-fill" />
        </span>
        {!isLast && <span data-line className={cn(CENTRED, "top-4.5 bottom-0 w-0.5 bg-border")} />}
    </div>
);

export const Timeline = ({ items, label }: { items: readonly TimelineItem[]; label: string }) => (
    <ol aria-label={label} className="max-w-xl text-left">
        {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
                <li key={item.id} className="grid grid-cols-[20px_1fr] gap-x-4.5">
                    <Marker status={item.status} isLast={isLast} />
                    <div className={cn(!isLast && "pb-8")}>
                        <h3 className="text-xl font-semibold">
                            {item.title}
                            <span className="sr-only"> ({STATUS_LABEL[item.status]})</span>
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                </li>
            );
        })}
    </ol>
);
