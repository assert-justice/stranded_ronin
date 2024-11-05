
export abstract class HudElement{
    abstract get width(): number;
    abstract get height(): number;
    abstract draw(x: number, y: number): void;
}