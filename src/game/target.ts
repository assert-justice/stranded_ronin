import { TileSprite } from "../libs/core/tile_sprite";
import { Actor } from "./actor";
import { Globals } from "./globals";
import { World } from "./world";

export class Target extends Actor{
    spr: TileSprite;
    constructor(world: World){
        super(world);
        this.spr = new TileSprite(Globals.textureManager.get('target'), 16, 16);
        this.offset.x = -8;
        this.offset.y = -8;
    }
    update(dt: number): void {
        super.update(dt);
        const radius = 8;
        for (const element of this.world.playerBullets.values()) {
            if(element.position.sub(this.position).length() < radius) this.cleanup();
        } 
    }
    draw(): void {
        this.spr.draw(this.position.x - 8, this.position.y - 8);
    }
}