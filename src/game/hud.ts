import { Text } from "../libs/core/text";
import { Globals, HEIGHT } from "./globals";
import { World } from "./world";

export class Hud{
    world: World;
    healthText: Text;
    manaText: Text;
    ammoText: Text;
    constructor(world: World){
        this.world = world;
        this.healthText = new Text(Globals.fontSpr, 0, "Health 100");
        this.manaText = new Text(Globals.fontSpr, 0, "Mana 100");
        this.ammoText = new Text(Globals.fontSpr, 0, "Ammo 20/100");
    }
    update(){
        this.ammoText.text = `Ammo ${this.world.player.magazine}/${this.world.player.ammo}`;
    }
    draw(){
        const ay = HEIGHT - this.ammoText.height;
        const my = ay - this.manaText.height;
        const hy = my - this.healthText.height;
        this.healthText.draw(0, hy);
        this.manaText.draw(0, my);
        this.ammoText.draw(0, ay);
    }
}