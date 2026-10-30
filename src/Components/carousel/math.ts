export interface DragPoint {
    time: number;
    x: number;
}

// How far one card step moves a neighbour, as a share of the card width
export const STEP_RATIO = 0.58;

const JUMP_DISTANCE = 2.2;
const VANISH_DISTANCE = 2.2;
const RUBBER_BAND = 0.35;
const VELOCITY_REACH_MS = 140;
const MAX_FLICK = 0.75;
const MAX_CARDS_PER_DRAG = 2;
const MAX_VELOCITY_POINTS = 6;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const wrapIndex = (index: number, count: number) => ((index % count) + count) % count;

// Signed distance from the centre in cards. Two cards cannot loop, so they keep plain left/right order.
export const offsetAt = (index: number, position: number, count: number): number => {
    const offset = index - position;
    if (count === 2) return offset;
    const wrapped = wrapIndex(offset, count);
    return wrapped > count / 2 ? wrapped - count : wrapped;
};

// A card that crosses the whole loop would fly across the stage, so it should reappear instead
export const isJump = (index: number, from: number, to: number, count: number): boolean =>
    Math.abs(offsetAt(index, to, count) - offsetAt(index, from, count)) > JUMP_DISTANCE;

export const cardStyle = (offset: number, flat: boolean) => {
    const distance = Math.abs(offset);
    const fade = flat ? (distance < 0.5 ? 1 : 0.35) : 1 - distance * 0.3;
    return {
        transform: flat
            ? `translateX(${offset * 108}%)`
            : `translateX(${offset * 58}%) translateZ(${-distance * 150}px) rotateY(${-offset * 34}deg) scale(${1 - distance * 0.05})`,
        opacity: distance > VANISH_DISTANCE ? 0 : Math.min(fade, (VANISH_DISTANCE - distance) * 1.2),
        zIndex: 10 - Math.round(distance),
    };
};

// Where the carousel sits while a finger or mouse has dragged it `dx` pixels
export const dragPosition = (startIndex: number, dx: number, step: number, count: number): number => {
    const position = startIndex - dx / step;
    if (count !== 2) return position;
    if (position < 0) return position * RUBBER_BAND;
    if (position > 1) return 1 + (position - 1) * RUBBER_BAND;
    return position;
};

export const velocityOf = (points: readonly DragPoint[]): number => {
    const recent = points.slice(-MAX_VELOCITY_POINTS);
    const first = recent[0];
    const last = recent[recent.length - 1];
    return first && last && last.time > first.time ? (last.x - first.x) / (last.time - first.time) : 0;
};

export const trimPoints = (points: DragPoint[]): DragPoint[] => points.slice(-MAX_VELOCITY_POINTS);

// Which card to settle on when the drag ends: the nearest one, nudged by how fast it was thrown,
// never more than one card of throw and never more than two cards from where the drag began
export const snapTarget = (options: {
    position: number;
    startIndex: number;
    velocity: number;
    step: number;
    count: number;
}): number => {
    const { position, startIndex, velocity, step, count } = options;
    const throwDistance = clamp((velocity * VELOCITY_REACH_MS) / step, -MAX_FLICK, MAX_FLICK);
    const target = clamp(Math.round(position - throwDistance), startIndex - MAX_CARDS_PER_DRAG, startIndex + MAX_CARDS_PER_DRAG);
    return count === 2 ? clamp(target, 0, 1) : target;
};
