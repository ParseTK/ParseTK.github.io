import type { AnchorHTMLAttributes } from "react";

export const NEW_TAB_NOTICE = "opens in a new tab";

interface ExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel" | "aria-label"> {
    href: string;
    label?: string;
}

export const ExternalLink = ({ label, children, ...rest }: ExternalLinkProps) => (
    <a
        {...rest}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label ? `${label} (${NEW_TAB_NOTICE})` : undefined}
    >
        {children}
        {!label && <span className="sr-only"> ({NEW_TAB_NOTICE})</span>}
    </a>
);
