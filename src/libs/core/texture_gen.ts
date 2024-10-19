import { Graphics, System } from "cleo";

export class TextureGen{
    private buf: ArrayBuffer;
    private view: Uint8Array;
    width: number;
    height: number;
    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        this.buf = new ArrayBuffer(width * height * 4);
        this.view = new Uint8Array(this.buf);
    }
    setPixel(x: number, y: number, r: number, b: number, g: number, a: number){
        if(x < 0 || x >= this.width || y < 0 || y >= this.height) throw 'setPixel out of bounds!';
        const idx = (y * this.width + x) * 4;
        // System.println(x, y, idx, r, g, b, a);
        this.view[idx] = r;
        this.view[idx+1] = g;
        this.view[idx+2] = b;
        this.view[idx+3] = a;
    }
    setAll(r: number, b: number, g: number, a: number){
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                this.setPixel(x, y, r, b, g, a);
            }
        }
    }
    getTexture(){
        return Graphics.Texture.new(this.width, this.height, this.buf);
    }
}