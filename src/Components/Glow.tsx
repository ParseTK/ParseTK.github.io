import { cn } from "./lib/utils";

// Place it inside an `isolate` section; position and strength come from className
export const Glow = ({ className }: { className?: string }) => (
    <div aria-hidden="true" className={cn("glow", className)} />
);
