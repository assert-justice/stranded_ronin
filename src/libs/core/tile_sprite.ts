import { Graphics } from "cleo";
import { Sprite } from "./sprite";
import { SpriteSheet } from "./sprite_sheet";

export class TileSprite extends Sprite{
    sheet: SpriteSheet;
    // widthScale = 1;
    // heightScale = 1;
    constructor(tex: Graphics.Texture, frameWidth: number, frameHeight: number){
        const sheet = new SpriteSheet(tex, frameWidth, frameHeight);
        super(tex, sheet.getSpriteProps(0));
        this.sheet = sheet;
    }
    setTile(idx: number){
        if(idx < 0 || idx >= this.sheet.frameCount) throw `Invalid tile index '${idx}'`;
        this.properties = this.sheet.getSpriteProps(idx, this.properties);
        // this.properties.width = this.properties.width ?? this.sheet.frameWidth * this.widthScale;
        // this.properties.height = this.properties.height ?? this.sheet.frameHeight * this.heightScale;
        if(this.flipH){
            const sw = this.properties.sw??this.sheet.tex.width;
            const sx = this.properties.sx??0;
            // if val is not flipped and sw is negative unflip sprite
            this.properties.sw = -sw;
            this.properties.sx = sx + sw;
        }
        if(this.flipV){
            const sh = this.properties.sh??this.sheet.tex.height;
            const sy = this.properties.sy??0;
            // if val is not flipped and sh is negative unflip sprite
            this.properties.sh = - sh;
        }
    }
}