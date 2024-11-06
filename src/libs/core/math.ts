export function clamp(value: number, min: number, max: number){
    return Math.min(max,Math.max(min, value));
}

export function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

export function angleDiff(x: number, y: number){
    return Math.atan2(Math.sin(x-y), Math.cos(x-y));
}