import { Color } from "../libs/core/color";
import { Text } from "../libs/core/text";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { HudBar } from "./hud_bar";
import { HudText } from "./hud_text";
import { World } from "./world";

export class Hud{
    world: World;
    healthBar: HudBar;
    backgroundBar: HudBar;
    manaBar: HudBar;
    staminaBar: HudBar;
    ammoText: HudText;
    constructor(world: World){
        this.world = world;
        const border = 2;
        this.healthBar = new HudBar(100, 8, 0.5, new Color(127, 0, 0), border);
        this.backgroundBar = new HudBar(100, 8, 1, new Color(0, 0, 0), border);
        this.manaBar = new HudBar(100, 8, 1, new Color(0, 0, 127), border);
        this.staminaBar = new HudBar(100, 8, 1, new Color(0, 127, 0), border);
        // this.manaText = new Text(Globals.fontSpr, 0, "Mana 100");
        this.ammoText = new HudText("Ammo 20/100");
    }
    update(){
        this.ammoText.text = `Ammo ${this.world.player.magazine}/${this.world.player.ammo}`;
    }
    draw(){
        const ax = WIDTH - this.ammoText.width;
        const ay = HEIGHT - this.ammoText.height;
        const sy = HEIGHT - this.staminaBar.height;
        const my = sy - this.manaBar.height;
        const hy = my - this.healthBar.height;
        this.backgroundBar.draw(0, hy);
        this.healthBar.draw(0, hy);
        this.backgroundBar.draw(0, my);
        this.manaBar.draw(0, my);
        this.backgroundBar.draw(0, sy);
        this.staminaBar.draw(0, sy);
        this.ammoText.draw(ax, ay);
    }
}