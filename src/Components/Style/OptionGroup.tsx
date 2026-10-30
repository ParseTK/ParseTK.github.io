import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";
import type { Option } from "@/style/registry";

interface OptionGroupProps<T extends Option> {
    legend: string;
    name: string;
    options: readonly T[];
    value: string;
    onChange: (id: string) => void;
    renderPreview: (option: T) => ReactNode;
    className?: string;
}

export const OptionGroup = <T extends Option>({
    legend,
    name,
    options,
    value,
    onChange,
    renderPreview,
    className,
}: OptionGroupProps<T>) => (
    <fieldset>
        <legend className="mb-2 text-sm font-medium text-muted-foreground">{legend}</legend>
        <div className={cn("grid gap-2", className)}>
            {options.map((option) => (
                <label key={option.id} className="relative block cursor-pointer text-left">
                    <input
                        type="radio"
                        name={name}
                        value={option.id}
                        aria-label={option.label}
                        checked={value === option.id}
                        onChange={() => onChange(option.id)}
                        className="peer sr-only"
                    />
                    <span
                        className={cn(
                            "block h-full rounded-md border border-input bg-card p-3 transition-colors",
                            "hover:border-primary peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary",
                            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
                        )}
                    >
                        {renderPreview(option)}
                    </span>
                    <Check
                        aria-hidden="true"
                        className="absolute right-2 top-2 hidden h-4 w-4 text-primary peer-checked:block"
                    />
                </label>
            ))}
        </div>
    </fieldset>
);
