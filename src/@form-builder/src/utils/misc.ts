export const isBrowser = typeof window !== "undefined";
export function on<T extends Window | Document | HTMLElement | EventTarget>(
    obj: T | null,
    ...args:
        | Parameters<T["addEventListener"]>
        | [string, () => void | null, ...any]
): void {
    if (obj && obj.addEventListener) {
        obj.addEventListener(
            ...(args as Parameters<HTMLElement["addEventListener"]>),
        );
    }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
    obj: T | null,
    ...args:
        | Parameters<T["removeEventListener"]>
        | [string, () => void | null, ...any]
): void {
    if (obj && obj.removeEventListener) {
        obj.removeEventListener(
            ...(args as Parameters<HTMLElement["removeEventListener"]>),
        );
    }
}
