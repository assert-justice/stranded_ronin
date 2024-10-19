import { Graphics, Window } from "cleo";

export class WindowDisplay{
    target: Graphics.Texture;
    pixelPerfect = false;
    constructor(target: Graphics.Texture){
        this.target = target;
    }
    draw(){
        // Calculate max x and y scale. Scale the texture by whichever is smaller
        const maxScaleX = Window.width / this.target.width;
        const maxScaleY = Window.height / this.target.height;
        let scale = Math.min(maxScaleX, maxScaleY);
        // If pixelPerfect, round scale down to nearest power of 2
        // TODO: actually test this
        if(this.pixelPerfect){
            const pow = Math.log2(scale);
            scale = Math.pow(2, Math.floor(pow));
        }
        const width = this.target.width * scale;
        const height = this.target.height * scale;
        const x = Window.width / 2 - width / 2;
        const y = Window.height / 2 - height / 2;
        this.target.draw(x, y, {width, height});
    }
}