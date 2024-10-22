import { System } from "cleo";
import { World } from "./world";
import { Convert } from "../libs/ldtk/ldtk";

export class Game{
    world: World;
    constructor(){
        // load world data
        const worldJson = System.readFile("./map.ldtk");
        if(!worldJson) throw 'Cannot open map file!';
        this.world = World.fromLdtk(Convert.toLdtk(worldJson));
    }
    update(dt: number){
        this.world.update(dt);
    }
    draw(){
        this.world.draw();
    }
}