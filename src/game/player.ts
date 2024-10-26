import { Graphics, System } from "cleo";
import { Actor } from "./actor";
import { World } from "./world";
import { VAxis2D } from "../libs/core/input_manager";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Vec2 } from "../libs/core/la";
import { SpriteSheet } from "../libs/core/sprite_sheet";
import { TileSprite } from "../libs/core/tile_sprite";

export class Player extends Actor{
    // tex: Graphics.Texture;
    reticule: Graphics.Texture;
    move: VAxis2D;
    aim: VAxis2D;
    speed = 300;
    spr: TileSprite;
    dir = 0;
    constructor(world: World){
        super(world);
        // this.tex = Graphics.Texture.fromColor(16, 16, 0, 255, 0, 255);
        this.reticule = Graphics.Texture.fromColor(4, 4, 255, 0, 0, 255);
        this.move = Globals.inputManager.getAxis2D("move");
        this.aim = Globals.inputManager.getAxis2D("aim");
        this.spr = new TileSprite(Globals.textureManager.get('player'), 16, 16);
    }
    update(dt: number): void {
        this.velocity = this.move.getValue().mulMutate(this.speed);
        if(this.velocity.y < 0) this.dir = 1;
        else if(this.velocity.y < 0) this.dir = 1;
        else if(this.velocity.x < 0) this.dir = 2;
        else if(this.velocity.x > 0) this.dir = 3;
        this.spr.setTile(this.dir);
        super.update(dt);
        // this.world.camera.position = this.position.copy();
    }
    draw(): void {
        // this.tex.draw(this.position.x, this.position.y);
        this.spr.draw(this.position.x, this.position.y);
        // const aim = this.aim.getValue().mul(10);
        // this.reticule.draw(this.position.x + aim.x, this.position.y + aim.y);
        const pos = Globals.app.getMousePosition().addMutate(this.world.camera.position).subMutate(new Vec2(WIDTH/2, HEIGHT/2));
        this.reticule.draw(pos.x, pos.y);
    }
}