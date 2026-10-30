import type { ReactNode } from "react";

export const Chip = ({ children }: { children: ReactNode }) => <li className="chip">{children}</li>;

export const ChipList = ({
    label,
    children,
    className,
}: {
    label?: string;
    children: ReactNode;
    className?: string;
}) => (
    <ul aria-label={label} className={className ?? "flex flex-wrap gap-2"}>
        {children}
    </ul>
);
