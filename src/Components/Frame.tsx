import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "./lib/utils";

type FrameProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

export const Frame = <T extends ElementType = "div">({ as, className, ...rest }: FrameProps<T>) => {
    const Component: ElementType = as ?? "div";
    return <Component className={cn("frame", className)} {...rest} />;
};
