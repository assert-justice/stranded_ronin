import { Color } from "../libs/core/color";
import { Text } from "../libs/core/text";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { HudBar } from "./hud_bar";
import { HudText } from "./hud_text";
import { World } from "./world";

export class Hud{
    world: World;
    backgroundBar: HudBar;
    healthBar: HudBar;
    manaBar: HudBar;
    staminaBar: HudBar;
    healthBarLast: HudBar;
    manaBarLast: HudBar;
    staminaBarLast: HudBar;
    ammoText: HudText;
    lastHealth = 0;
    lastMana = 0;
    lastStamina = 0;
    barSpeed = 0.5;
    constructor(world: World){
        this.world = world;
        const border = 2;
        this.backgroundBar = new HudBar(100, 8, 1, new Color(0, 0, 0), border);
        this.healthBar = new HudBar(100, 8, 0.5, new Color(127, 0, 0), border);
        this.manaBar = new HudBar(100, 8, 1, new Color(0, 0, 127), border);
        this.staminaBar = new HudBar(100, 8, 1, new Color(0, 127, 0), border);
        this.healthBarLast = new HudBar(100, 8, 0.5, new Color(255, 255, 0), border);
        this.manaBarLast = new HudBar(100, 8, 1, new Color(0, 0, 255), border);
        this.staminaBarLast = new HudBar(100, 8, 1, new Color(0, 255, 0), border);
        this.ammoText = new HudText("Ammo 20/100");
    }
    update(dt: number){
        const player = this.world.player;
        this.ammoText.text = `Ammo ${player.magazine}/${player.ammo}`;
        this.healthBar.value = player.health / player.maxHealth;
        this.manaBar.value = player.mana / player.maxMana;
        this.staminaBar.value = player.stamina / player.maxStamina;
        if(this.staminaBarLast.value > this.staminaBar.value){this.staminaBarLast.value -= dt * this.barSpeed;}
        if(this.staminaBarLast.value < this.staminaBar.value){this.staminaBarLast.value = this.staminaBar.value;}
        if(this.healthBarLast.value > this.healthBar.value){this.healthBarLast.value -= dt * this.barSpeed;}
        if(this.healthBarLast.value < this.healthBar.value){this.healthBarLast.value = this.healthBar.value;}
        if(this.manaBarLast.value > this.manaBar.value){this.manaBarLast.value -= dt * this.barSpeed;}
        if(this.manaBarLast.value < this.manaBar.value){this.manaBarLast.value = this.manaBar.value;}
    }
    draw(){
        const ax = WIDTH - this.ammoText.width;
        const ay = HEIGHT - this.ammoText.height;
        const sy = HEIGHT - this.staminaBar.height;
        const my = sy - this.manaBar.height;
        const hy = my - this.healthBar.height;
        this.backgroundBar.draw(0, hy);
        this.healthBarLast.draw(0, hy);
        this.healthBar.draw(0, hy);

        this.backgroundBar.draw(0, my);
        this.manaBarLast.draw(0, my);
        this.manaBar.draw(0, my);

        this.backgroundBar.draw(0, sy);
        this.staminaBarLast.draw(0, sy);
        this.staminaBar.draw(0, sy);

        this.ammoText.draw(ax, ay);
    }
}