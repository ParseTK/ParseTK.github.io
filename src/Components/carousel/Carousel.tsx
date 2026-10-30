import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { useMediaQuery } from "../lib/useMediaQuery";
import { Tooltip } from "../Tooltip";
import {
    STEP_RATIO,
    cardStyle,
    dragPosition,
    isJump,
    offsetAt,
    snapTarget,
    trimPoints,
    velocityOf,
    wrapIndex,
    type DragPoint,
} from "./math";

interface CarouselProps<T> {
    label: string;
    noun: string;
    items: readonly T[];
    getKey: (item: T) => string;
    getTitle: (item: T) => string;
    renderItem: (item: T) => ReactNode;
    className?: string;
}

interface Drag {
    pointerId: number;
    startX: number;
    startY: number;
    startIndex: number;
    points: DragPoint[];
    active: boolean;
    position: number;
}

const DRAG_THRESHOLD = 6;
const FALLBACK_CARD_WIDTH = 400;

const arrowButtonClass =
    "size-11 shrink-0 grid place-items-center rounded-full border border-input bg-card text-foreground transition-colors hover:border-primary hover:text-primary";

export const Carousel = <T,>({ label, noun, items, getKey, getTitle, renderItem, className }: CarouselProps<T>) => {
    const count = items.length;
    const flat = useMediaQuery("(prefers-reduced-motion: reduce)");
    const stageRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<Drag | null>(null);
    const suppressClickRef = useRef(false);

    // `from` is where the last move started, so a card that wraps around the loop can reappear instead of flying across
    const [view, setView] = useState({ current: 0, from: 0 });
    const [draggedTo, setDraggedTo] = useState<number | null>(null);

    const position = draggedTo ?? view.current;
    const isDragging = draggedTo !== null;

    const go = (index: number) => {
        if (count < 2) return;
        setView((previous) => ({ current: wrapIndex(index, count), from: previous.current }));
    };

    const cardStep = () =>
        (stageRef.current?.querySelector<HTMLElement>("[data-slide]")?.offsetWidth || FALLBACK_CARD_WIDTH) * STEP_RATIO;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
        if (!direction) return;
        event.preventDefault();
        go(view.current + direction);
        if (event.target !== event.currentTarget) event.currentTarget.focus();
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (count < 2 || (event.pointerType === "mouse" && event.button !== 0)) return;
        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startIndex: view.current,
            points: [{ time: event.timeStamp, x: event.clientX }],
            active: false,
            position: view.current,
        };
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || event.pointerId !== drag.pointerId) return;

        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.active) {
            if (Math.abs(dx) < DRAG_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
            drag.active = true;
            event.currentTarget.setPointerCapture?.(event.pointerId);
        }

        drag.points = trimPoints([...drag.points, { time: event.timeStamp, x: event.clientX }]);
        drag.position = dragPosition(drag.startIndex, dx, cardStep(), count);
        setDraggedTo(drag.position);
    };

    const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        dragRef.current = null;
        if (!drag.active) return;

        suppressClickRef.current = true;
        setTimeout(() => {
            suppressClickRef.current = false;
        }, 0);

        const target = snapTarget({
            position: drag.position,
            startIndex: drag.startIndex,
            velocity: velocityOf(drag.points),
            step: cardStep(),
            count,
        });
        setView({ current: wrapIndex(target, count), from: drag.position });
        setDraggedTo(null);
    };

    // A click that ends a drag must not open the link under the pointer
    const handleClickCapture = (event: MouseEvent) => {
        if (!suppressClickRef.current) return;
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div className={className}>
            <div
                ref={stageRef}
                role="region"
                aria-roledescription="carousel"
                aria-label={label}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                onClickCapture={handleClickCapture}
                onDragStart={(event) => event.preventDefault()}
                className={cn(
                    "mx-auto grid max-w-250 select-none justify-items-center rounded-md py-2.5 [perspective:1300px] [touch-action:pan-y]",
                    count > 1 && (isDragging ? "cursor-grabbing" : "cursor-grab"),
                )}
            >
                {items.map((item, index) => {
                    const isActive = index === view.current;
                    const animate = !isDragging && !isJump(index, view.from, view.current, count);
                    return (
                        <div
                            key={getKey(item)}
                            data-slide
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${getTitle(item)}, ${index + 1} of ${count}`}
                            aria-hidden={isActive ? undefined : true}
                            onClick={() => {
                                if (!isActive) go(index);
                            }}
                            style={cardStyle(offsetAt(index, position, count), flat)}
                            className={cn(
                                "col-start-1 row-start-1 w-[min(400px,80%)] will-change-transform",
                                animate
                                    ? "[transition:transform_700ms_cubic-bezier(0.2,0.7,0.2,1),opacity_500ms]"
                                    : "transition-none",
                                !isActive && "cursor-pointer",
                            )}
                        >
                            <div inert={!isActive} className="h-full">
                                {renderItem(item)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <p role="status" className="sr-only">
                {count > 0 && `${getTitle(items[view.current])}, ${noun} ${view.current + 1} of ${count}`}
            </p>

            {count > 1 && (
                <div className="mt-2 flex items-center justify-center gap-5">
                    <Tooltip label={`Previous ${noun}`}>
                        <button
                            type="button"
                            aria-label={`Previous ${noun}`}
                            onClick={() => go(view.current - 1)}
                            className={arrowButtonClass}
                        >
                            <ChevronLeft size={20} aria-hidden="true" />
                        </button>
                    </Tooltip>
                    <div className="flex flex-col items-center">
                        <div role="group" aria-label={`Choose a ${noun}`} className="flex">
                            {items.map((item, index) => {
                                const isCurrent = index === view.current;
                                return (
                                    <Tooltip key={getKey(item)} label={getTitle(item)}>
                                        <button
                                            type="button"
                                            aria-label={`Show ${noun} ${index + 1}: ${getTitle(item)}`}
                                            aria-current={isCurrent ? "true" : undefined}
                                            onClick={() => go(index)}
                                            className="group grid h-6 min-w-6 cursor-pointer place-items-center"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    "block h-[7px] rounded-full transition-all duration-300 group-hover:bg-primary/70",
                                                    isCurrent ? "w-[22px] bg-primary" : "w-[7px] bg-border",
                                                )}
                                            />
                                        </button>
                                    </Tooltip>
                                );
                            })}
                        </div>
                        <span aria-hidden="true" className="text-xs text-muted-foreground">
                            {view.current + 1} of {count}
                        </span>
                    </div>
                    <Tooltip label={`Next ${noun}`}>
                        <button
                            type="button"
                            aria-label={`Next ${noun}`}
                            onClick={() => go(view.current + 1)}
                            className={arrowButtonClass}
                        >
                            <ChevronRight size={20} aria-hidden="true" />
                        </button>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};
