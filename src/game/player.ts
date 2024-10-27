import { Graphics, System } from "cleo";
import { Actor } from "./actor";
import { World } from "./world";
import { VAxis2D, VButton } from "../libs/core/input_manager";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Vec2 } from "../libs/core/la";
import { TileSprite } from "../libs/core/tile_sprite";
import { Bullet } from "./bullet";

export class Player extends Actor{
    reticule: Graphics.Texture;
    move: VAxis2D;
    aim: VAxis2D;
    fire: VButton;
    inputMode: 'mk' | 'gamepad' = 'mk';
    speed = 300;
    bulletSpeed = 600;
    spr: TileSprite;
    dir = 0;
    aimDir = 0;
    constructor(world: World){
        super(world);
        this.reticule = Graphics.Texture.fromColor(4, 4, 255, 0, 0, 255);
        this.move = Globals.inputManager.getAxis2D("move");
        this.aim = Globals.inputManager.getAxis2D("aim");
        this.fire = Globals.inputManager.getButton("fire");
        this.spr = new TileSprite(Globals.textureManager.get('player'), 16, 16);
    }
    update(dt: number): void {
        this.velocity = this.move.getValue().mulMutate(this.speed);
        if(this.velocity.y > 0) this.dir = 0;
        else if(this.velocity.y < 0) this.dir = 1;
        else if(this.velocity.x < 0) this.dir = 2;
        else if(this.velocity.x > 0) this.dir = 3;
        this.spr.setTile(this.dir);
        if(this.inputMode === 'mk'){
            const pos = Globals.app.getMousePosition().addMutate(this.world.camera.position).subMutate(new Vec2(WIDTH/2, HEIGHT/2)).subMutate(this.position);
            this.aimDir = pos.angle();
        }
        if(this.fire.isPressed()){
            const bullet = this.world.playerBullets.getNew() as Bullet;
            const aimX = Math.cos(this.aimDir);
            const aimY = Math.sin(this.aimDir);
            bullet.velocity = new Vec2(aimX, aimY).mulMutate(this.bulletSpeed);
            bullet.position = this.position.copy();
            // System.println(bullet.velocity.toString());
        }
        super.update(dt);
    }
    draw(): void {
        this.spr.draw(this.position.x, this.position.y);
        const pos = Globals.app.getMousePosition().addMutate(this.world.camera.position).subMutate(new Vec2(WIDTH/2, HEIGHT/2));
        this.reticule.draw(pos.x, pos.y);
    }
}