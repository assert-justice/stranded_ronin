import { Graphics, Input, Window } from "cleo";
import { Vec2 } from "../libs/core/la";

export class WindowDisplay{
    target: Graphics.Texture;
    pixelPerfect = false;
    constructor(target: Graphics.Texture){
        this.target = target;
    }
    private calculate(): [number, number, number, number, number]{
        // return width, height, scale, xOffset, yOffset
        // Calculate max x and y scale. Scale the texture by whichever is smaller
        const maxScaleX = Window.width / this.target.width;
        const maxScaleY = Window.height / this.target.height;
        let scale = Math.min(maxScaleX, maxScaleY);
        // If pixelPerfect, round scale down to nearest power of 2
        if(this.pixelPerfect){
            const pow = Math.log2(scale);
            scale = Math.pow(2, Math.floor(pow));
        }
        const width = this.target.width * scale;
        const height = this.target.height * scale;
        const x = Window.width / 2 - width / 2;
        const y = Window.height / 2 - height / 2;
        return [width, height, scale, x, y];
    }
    draw(){
        const [width, height, _scale, x, y] = this.calculate();
        this.target.draw(x, y, {width, height});
    }
    getMousePosition(): Vec2{
        const [_width, _height, scale, x, y] = this.calculate();
        const res = new Vec2(Input.mouseX-x, Input.mouseY-y);
        res.mulMutate(1/scale);
        return res;
    }
}