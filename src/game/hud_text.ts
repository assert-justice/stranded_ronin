import { Text } from "../libs/core/text";
import { Globals } from "./globals";
import { HudElement } from "./hud_element";

export class HudText extends HudElement{
    private _text: Text;
    private _width: number;
    private _height: number;
    get text(){return this._text.text;}
    set text(text: string){this._text.text = text;}
    get width(){return this._width;}
    get height(){return this._height;}
    constructor(text: string, width?: number, height?: number){
        super();
        this._text = new Text(Globals.fontSpr, 0, text);
        this._width = width ?? this._text.width;
        this._height = height ?? this._text.height;
    }
    draw(x: number, y: number): void {
        this._text.draw(x, y);
    }
}