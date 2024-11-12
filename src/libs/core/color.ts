import { Graphics } from "cleo";

export class Color{
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a?:number){
        this.r = r; this.g = g; this.b = b; this.a = a ?? 255;
    }
    getTexture(width: number, height: number){
        return Graphics.Texture.fromColor(width, height, this.r, this.g, this.b, this.a);
    }
}
