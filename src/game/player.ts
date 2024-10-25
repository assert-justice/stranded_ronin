import { Graphics, System } from "cleo";
import { Actor } from "./actor";
import { World } from "./world";
import { VAxis2D } from "../libs/core/input_manager";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Vec2 } from "../libs/core/la";

export class Player extends Actor{
    tex: Graphics.Texture;
    reticule: Graphics.Texture;
    move: VAxis2D;
    aim: VAxis2D;
    speed = 300;
    constructor(world: World){
        super(world);
        this.tex = Graphics.Texture.fromColor(16, 16, 0, 255, 0, 255);
        this.reticule = Graphics.Texture.fromColor(4, 4, 255, 0, 0, 255);
        this.move = Globals.inputManager.getAxis2D("move");
        this.aim = Globals.inputManager.getAxis2D("aim");
    }
    update(dt: number): void {
        this.velocity = this.move.getValue().mulMutate(this.speed);
        super.update(dt);
        // this.world.camera.position = this.position.copy();
    }
    draw(): void {
        this.tex.draw(this.position.x, this.position.y);
        // const aim = this.aim.getValue().mul(10);
        // this.reticule.draw(this.position.x + aim.x, this.position.y + aim.y);
        const pos = Globals.app.getMousePosition().addMutate(this.world.camera.position).subMutate(new Vec2(WIDTH/2, HEIGHT/2));
        this.reticule.draw(pos.x, pos.y);
    }
}