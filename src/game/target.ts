import { TileSprite } from "../libs/core/tile_sprite";
import { Actor } from "./actor";
import { Globals } from "./globals";
import { World } from "./world";

export class Target extends Actor{
    spr: TileSprite;
    constructor(world: World){
        super(world);
        this.spr = new TileSprite(Globals.textureManager.get('target'), 16, 16);
    }
    update(dt: number): void {
        super.update(dt);
    }
    draw(): void {
        this.spr.draw(this.position.x, this.position.y);
    }
}