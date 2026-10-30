import "vitest";

declare module "vitest" {
    interface Assertion<R extends void | Promise<void> = void, T = unknown> {
        toHaveNoViolations(this: Assertion<R, T>): R;
    }
}
