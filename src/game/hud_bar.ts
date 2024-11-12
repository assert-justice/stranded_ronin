import { Graphics } from "cleo";
import { Color } from "../libs/core/color";
import { HudElement } from "./hud_element";

export class HudBar extends HudElement{
    private _width: number;
    private _height: number;
    get width(){return this._width;}
    get height(){return this._height;}
    private tex: Graphics.Texture;
    border: number;
    value: number;
    constructor(width: number, height: number, startValue: number, color: Color, border: number){
        super();
        this._width = width; this._height = height;
        this.tex = color.getTexture(1, 1);
        this.border = border;
        this.value = startValue;
    }
    draw(x: number, y: number): void {
        const border = this.border;
        const barWidth = this._width - border*2;
        const barHeight = this._height - border*2;
        const pWidth = this.value * barWidth;
        this.tex.draw(x + border, y + border, {width: pWidth, height: barHeight});
    }
}