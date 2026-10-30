import { useEffect } from "react";

// Sets the tab title while the component is on screen, then puts the previous one back
export const useDocumentTitle = (title: string) => {
    useEffect(() => {
        const previous = document.title;
        document.title = title;
        return () => {
            document.title = previous;
        };
    }, [title]);
};
