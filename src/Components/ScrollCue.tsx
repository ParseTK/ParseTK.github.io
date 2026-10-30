import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "./lib/utils";

type ScrollCueProps = {
    label: string;
    accessibleName: string;
    className?: string;
} & (
    | { direction: "down"; href: string }
    | { direction: "up"; onClick: () => void }
);

const CUE_CLASS =
    "flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-primary";

// Bounces towards the way it points: the down cue hops up and settles, the up cue hops down and settles
export const ScrollCue = (props: ScrollCueProps) => {
    const { label, accessibleName, className } = props;
    const isDown = props.direction === "down";
    const Arrow = isDown ? ArrowDown : ArrowUp;
    const content = (
        <>
            <span>{label}</span>
            <Arrow aria-hidden="true" className={cn("h-5 w-5 text-primary", isDown ? "animate-bounce" : "animate-bounce-up")} />
        </>
    );

    return props.direction === "down" ? (
        <a href={props.href} aria-label={accessibleName} className={cn(CUE_CLASS, className)}>
            {content}
        </a>
    ) : (
        <button type="button" onClick={props.onClick} aria-label={accessibleName} className={cn(CUE_CLASS, className)}>
            {content}
        </button>
    );
};
