import { AnimatedSprite, SpriteAnimation } from "../libs/core/animated_sprite";
import { SpriteSheet } from "../libs/core/sprite_sheet";
import { Actor } from "./actor";
import { Globals } from "./globals";
import { World } from "./world";

export class Target extends Actor{
    spr: AnimatedSprite;
    health = 10;
    constructor(world: World){
        super(world);
        const sprSheet = new SpriteSheet(Globals.textureManager.get('target'), 16, 16);
        this.spr = new AnimatedSprite(sprSheet);
        this.spr.addAnimation(new SpriteAnimation('down', 6, 'loop', [0, 4, 8, 12]));
        this.spr.addAnimation(new SpriteAnimation('up', 6, 'loop', [1, 5, 9, 13]));
        this.spr.addAnimation(new SpriteAnimation('left', 6, 'loop', [2, 6, 10, 14]));
        this.spr.addAnimation(new SpriteAnimation('right', 6, 'loop', [3, 7, 9, 15]));
        this.spr.setAnimation('down');
        this.spr.play();
        this.spr.properties.ox = 8;
        this.spr.properties.oy = 8;
    }
    update(dt: number): void {
        this.spr.update(dt);
        super.update(dt);
    }
    draw(): void {
        this.spr.draw(this.position.x, this.position.y);
    }
    damage(val: number): void {
        this.health -= val;
        if(this.health <= 0) this.cleanup();
    }
}