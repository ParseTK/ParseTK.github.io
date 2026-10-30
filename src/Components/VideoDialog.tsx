import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { useOverlay } from "./lib/useOverlay";

interface VideoDialogProps {
    title: string;
    src: string;
    poster?: string;
    onClose: () => void;
}

// A pop-out player. It is only rendered while open, so the video is not fetched until someone asks for it.
// The native dialog gives the focus trap, the Escape key, a page that cannot be reached behind it,
// and returns focus to the button that opened it.
export const VideoDialog = ({ title, src, poster, onClose }: VideoDialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog?.showModal();
        return () => {
            if (dialog?.open) dialog.close();
        };
    }, []);

    useOverlay({ isOpen: true, onClose });

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onClose={onClose}
            // The dialog is only as big as its content, so a click on the dimmed page is a click on the dialog itself
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            className="m-auto w-[min(60rem,92vw)] max-w-none overflow-hidden rounded-lg border border-border bg-background p-0 text-foreground backdrop:bg-black/75"
        >
            <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2 md:px-5">
                <h2 id={titleId} className="min-w-0 truncate text-base font-semibold md:text-lg">
                    {title}
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close video"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-foreground/80 transition-colors duration-300 hover:text-primary"
                >
                    <X size={22} aria-hidden="true" />
                </button>
            </div>
            <video
                controls
                autoPlay
                playsInline
                preload="auto"
                poster={poster}
                className="block aspect-video max-h-[75svh] w-full bg-black"
            >
                <source src={src} type="video/mp4" />
                Your browser cannot play this video. You can download it from {src}.
            </video>
        </dialog>
    );
};
