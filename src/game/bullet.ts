import { AnimatedSprite, SpriteAnimation } from "../libs/core/animated_sprite";
import { SpriteSheet } from "../libs/core/sprite_sheet";
import { Actor } from "./actor";
import { Globals } from "./globals";
import { World } from "./world";

export class Bullet extends Actor{
    spr: AnimatedSprite;
    constructor(world: World){
        super(world);
        const sprSheet = new SpriteSheet(Globals.textureManager.get('shuriken'), 16, 16)
        this.spr = new AnimatedSprite(sprSheet);
        this.spr.addAnimation(new SpriteAnimation('default', 12, 'loop', [0,1]));
        this.spr.setAnimation("default");
        this.spr.properties.ox = 8;
        this.spr.properties.oy = 8;
    }
    init(): void {
        this.spr.play();
    }
    update(dt: number): void {
        dt *= Globals.timeScale;
        const speed = this.velocity.length();
        super.update(dt);
        this.spr.update(dt);
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
        this.spr.draw(this.position.x, this.position.y);
    }
    damage(val: number): void {
        //
    }
}