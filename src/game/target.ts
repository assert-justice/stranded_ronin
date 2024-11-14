import { AnimatedSprite, SpriteAnimation } from "../libs/core/animated_sprite";
import { SpriteSheet } from "../libs/core/sprite_sheet";
import { Actor } from "./actor";
import { Globals } from "./globals";
import { World } from "./world";

export class Target extends Actor{
    spr: AnimatedSprite;
    health = 10;
    speed = 50;
    walkClock = 0;
    constructor(world: World){
        super(world);
        const sprSheet = new SpriteSheet(Globals.textureManager.get('target'), 16, 16);
        this.spr = new AnimatedSprite(sprSheet);
        this.spr.addAnimation(new SpriteAnimation('down', 6, 'loop', [0, 4, 8, 12]));
        this.spr.addAnimation(new SpriteAnimation('up', 6, 'loop', [1, 5, 9, 13]));
        this.spr.addAnimation(new SpriteAnimation('left', 6, 'loop', [2, 6, 10, 14]));
        this.spr.addAnimation(new SpriteAnimation('right', 6, 'loop', [3, 7, 9, 15]));
        this.spr.properties.ox = 8;
        this.spr.properties.oy = 8;
    }
    init(): void {
        this.spr.setAnimation('down');
        this.spr.play();
        this.randomDir();
    }
    update(dt: number): void {
        dt *= Globals.timeScale;
        this.spr.update(dt);
        const s = this.velocity.length();
        super.update(dt);
        if(this.velocity.length() < s){this.randomDir();}
        else if(this.walkClock > 0){
            this.walkClock -= dt;
            if(this.walkClock <= 0) this.randomDir();
        }
    }
    draw(): void {
        this.spr.draw(this.position.x, this.position.y);
    }
    damage(val: number): void {
        this.health -= val;
        if(this.health <= 0) this.cleanup();
    }
    randomDir(){
        const idx = Math.floor(Math.random() * 4);
        const dirs: [string, number, number][] = [
            ['down', 0, 1],
            ['up', 0, -1],
            ['left', -1, 0],
            ['right', 1, 0],
        ];
        const [anim, dx, dy] = dirs[idx];
        this.spr.setAnimation(anim);
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.velocity.mulMutate(this.speed);
        this.walkClock = Math.random() + 1;
    }
}