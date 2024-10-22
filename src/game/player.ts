import { Graphics, System } from "cleo";
import { Actor } from "./actor";
import { World } from "./world";
import { VAxis2D } from "../libs/core/input_manager";
import { Globals } from "./globals";

export class Player extends Actor{
    tex: Graphics.Texture;
    move: VAxis2D;
    speed = 300;
    constructor(world: World){
        super(world);
        this.tex = Graphics.Texture.fromColor(16, 16, 0, 255, 0, 255);
        this.move = Globals.inputManager.getAxis2D("move");
    }
    update(dt: number): void {
        this.velocity = this.move.getValue().mulMutate(this.speed);
        super.update(dt);
    }
    draw(): void {
        this.tex.draw(this.position.x, this.position.y);
    }
}