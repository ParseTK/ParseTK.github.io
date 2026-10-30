// jsdom has no canvas; this stands in for a 2D context and remembers what was drawn
export interface Arc {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    fillStyle: string;
}

export interface FakeContext {
    arcs: Arc[];
    clears: number;
    transform: number[] | null;
    globalAlpha: number;
    fillStyle: string;
    clearRect: () => void;
    setTransform: (...values: number[]) => void;
    beginPath: () => void;
    arc: (x: number, y: number, radius: number) => void;
    fill: () => void;
    createImageData: (width: number, height: number) => { data: Uint8ClampedArray };
    putImageData: () => void;
}

export const createFakeContext = (): FakeContext => {
    const ctx: FakeContext = {
        arcs: [],
        clears: 0,
        transform: null,
        globalAlpha: 1,
        fillStyle: "",
        clearRect: () => {
            ctx.clears += 1;
            ctx.arcs = [];
        },
        setTransform: (...values) => {
            ctx.transform = values;
        },
        beginPath: () => {},
        arc: (x, y, radius) => {
            ctx.arcs.push({ x, y, radius, alpha: ctx.globalAlpha, fillStyle: ctx.fillStyle });
        },
        fill: () => {},
        createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
        putImageData: () => {},
    };
    return ctx;
};

let current = createFakeContext();

export const fakeContext = () => current;

export const installFakeCanvas = () => {
    current = createFakeContext();
    HTMLCanvasElement.prototype.getContext = (() => current) as unknown as HTMLCanvasElement["getContext"];
    HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,AAAA";
};

// Animation frames wait until a test runs them, so time and scrolling stay under its control
const queue = new Map<number, FrameRequestCallback>();
let nextId = 1;

export const installFakeFrames = () => {
    queue.clear();
    nextId = 1;
    window.requestAnimationFrame = (callback) => {
        queue.set(nextId, callback);
        return nextId++;
    };
    window.cancelAnimationFrame = (id) => {
        queue.delete(id);
    };
};

export const runFrame = (milliseconds: number) => {
    const callbacks = [...queue.values()];
    queue.clear();
    callbacks.forEach((callback) => callback(milliseconds));
};

export const pendingFrames = () => queue.size;
