import { AABB } from "../libs/core/aabb";
import { Entity } from "../libs/core/entity";
import { Vec2 } from "../libs/core/la";
import { World } from "./world";

export abstract class Actor extends Entity{
    velocity: Vec2;
    world: World;
    offset: Vec2;
    constructor(world: World){
        super();
        this.velocity = new Vec2();
        this.world = world;
        this.offset = new Vec2();
    }
    update(dt: number): void {
        this.world.moveAndSlide(dt, this.velocity, new AABB(this.position, 16, 16, this.offset));
    }
}