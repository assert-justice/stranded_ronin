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
    reload: VButton;
    inputMode: 'mk' | 'gamepad' = 'mk';
    speed = 300;
    bulletSpeed = 600;
    spr: TileSprite;
    dir = 0;
    aimDir = 0;
    magazine = 20;
    magCapacity = 20;
    ammo = 100;
    fireClock = 0;
    reloadClock = 0;
    constructor(world: World){
        super(world);
        this.reticule = Graphics.Texture.fromColor(4, 4, 255, 0, 0, 255);
        this.move = Globals.inputManager.getAxis2D("move");
        this.aim = Globals.inputManager.getAxis2D("aim");
        this.fire = Globals.inputManager.getButton("fire");
        this.reload = Globals.inputManager.getButton("reload");
        this.spr = new TileSprite(Globals.textureManager.get('player'), 16, 16);
        this.offset.x = -8;
        this.offset.y = -8;
    }
    update(dt: number): void {
        if(this.fireClock > 0) this.fireClock -= dt;
        if(this.reloadClock > 0) this.reloadClock -= dt;
        this.velocity = this.move.getValue().mulMutate(this.speed);
        if(this.velocity.y > 0) this.dir = 0;
        else if(this.velocity.y < 0) this.dir = 1;
        else if(this.velocity.x < 0) this.dir = 2;
        else if(this.velocity.x > 0) this.dir = 3;
        this.spr.setTile(this.dir);
        if(this.inputMode === 'mk'){
            // const pos = Globals.app.getMousePosition().addMutate(this.world.camera.position).subMutate(new Vec2(WIDTH/2, HEIGHT/2)).subMutate(this.position);
            // this.aimDir = pos.angle();
            this.aimDir = this.aim.getValue().angle();
        }
        if(this.fire.isDown() && this.fireClock <= 0 && this.reloadClock <= 0 && this.magazine > 0){
            const bullet = this.world.playerBullets.getNew() as Bullet;
            const aimX = Math.cos(this.aimDir);
            const aimY = Math.sin(this.aimDir);
            bullet.velocity = new Vec2(aimX, aimY).mulMutate(this.bulletSpeed);
            bullet.position = this.position.copy();
            this.magazine--;
            this.fireClock = 0.3;
        }
        if(this.reload.isPressed() && this.magazine < this.magCapacity){
            this.reloadClock = 1;
            const missing = this.magCapacity - this.magazine;
            const amount = missing < this.ammo ? missing : this.ammo;
            this.ammo -= amount;
            this.magazine += amount;
        }
        super.update(dt);
    }
    draw(): void {
        this.spr.draw(this.position.x - 8, this.position.y - 8);
        // const pos = Globals.app.getMousePosition().addMutate(this.world.camera.position).subMutate(new Vec2(WIDTH/2, HEIGHT/2));
        const pos = this.aim.getValue().mulMutate(16).addMutate(this.position);
        this.reticule.draw(pos.x, pos.y);
    }
}