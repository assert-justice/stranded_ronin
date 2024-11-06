import { TileSprite } from "../libs/core/tile_sprite";
import { Actor } from "./actor";
import { Globals } from "./globals";
import { World } from "./world";

export class Bullet extends Actor{
    spr: TileSprite;
    constructor(world: World){
        super(world);
        this.spr = new TileSprite(Globals.textureManager.get('shuriken'), 16, 16);
        this.offset.x = -8;
        this.offset.y = -8;
    }
    update(dt: number): void {
        const speed = this.velocity.length();
        super.update(dt);
        if(this.velocity.length() < speed) this.cleanup();
        for (const e of this.world.targets.values()) {
            const ent = e as Actor;
            if(ent.position.sub(this.position).length() < 8){
                ent.damage(5);
                this.cleanup();
            }
        }
    }
    draw(): void {
        this.spr.draw(this.position.x - 8, this.position.y - 8);
    }
    damage(val: number): void {
        //
    }
}