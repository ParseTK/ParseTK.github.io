export type TimelineStatus = "completed" | "in-progress";

export interface TimelineItem {
    id: string;
    title: string;
    detail: string;
    status: TimelineStatus;
}

export const STATUS_LABEL: Record<TimelineStatus, string> = {
    completed: "completed",
    "in-progress": "in progress",
};

// Newest first
export const timeline: readonly TimelineItem[] = [
    {
        id: "elms",
        title: "Elms College",
        detail: "B.S. in CS and CITS, graduating 2027",
        status: "in-progress",
    },
    {
        id: "internship",
        title: "Software engineering intern",
        detail: "Product team: shipped features end to end on a RAG platform",
        status: "completed",
    },
    {
        id: "stcc",
        title: "STCC",
        detail: "A.S. in Computer Programming",
        status: "completed",
    },
];
