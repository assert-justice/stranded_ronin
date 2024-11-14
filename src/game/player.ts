import { Engine, System } from "cleo";
import { Actor } from "./actor";
import { World } from "./world";
import { VAxis2D, VButton } from "../libs/core/input_manager";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Vec2 } from "../libs/core/la";
import { Bullet } from "./bullet";
import { AnimatedSprite, SpriteAnimation } from "../libs/core/animated_sprite";
import { SpriteSheet } from "../libs/core/sprite_sheet";
import { angleDiff } from "../libs/core/math";
import { Sprite } from "../libs/core/sprite";

export class Player extends Actor{
    move: VAxis2D;
    aim: VAxis2D;
    meleeButton: VButton;
    fireButton: VButton;
    reloadButton: VButton;
    dashButton: VButton;
    spellButton: VButton;
    healButton: VButton;
    chronoButton: VButton;
    inputMode: 'mk' | 'gamepad' = 'mk';
    speed = 200;
    dashSpeed = 400;
    bulletSpeed = 300;
    spr: AnimatedSprite;
    sword: AnimatedSprite;
    wand: Sprite;
    aimDir = 0;
    magazine = 20;
    magCapacity = 20;
    ammo = 100;
    fireClock = 0;
    reloadClock = 0;
    health = 100;
    maxHealth = 100;
    mana = 100;
    maxMana = 100;
    stamina = 100;
    maxStamina = 100;
    staminaRegen = 50;
    staminaDelay = 0.5;
    staminaClock = 0;
    staminaUsable = true;
    dashCost = 30;
    dashClock = 0;
    dashDuration = 0.3;
    chrono = 100;
    maxChrono = 100;
    chronoRegen = 50;
    chronoDeplete = 25;
    chronoUseable = true;
    constructor(world: World){
        super(world);
        this.move = Globals.inputManager.getAxis2D("move");
        this.aim = Globals.inputManager.getAxis2D("aim");
        this.meleeButton = Globals.inputManager.getButton("melee");
        this.fireButton = Globals.inputManager.getButton("fire");
        this.reloadButton = Globals.inputManager.getButton("reload");
        this.dashButton = Globals.inputManager.getButton("dash");
        this.spellButton = Globals.inputManager.getButton("spell");
        this.healButton = Globals.inputManager.getButton("heal");
        this.chronoButton = Globals.inputManager.getButton("chrono");
        const sprSheet = new SpriteSheet(Globals.textureManager.get('player'), 16, 16);
        this.spr = new AnimatedSprite(sprSheet);
        this.spr.addAnimation(new SpriteAnimation('down', 12, 'loop', [0, 4, 8, 12]));
        this.spr.addAnimation(new SpriteAnimation('up', 12, 'loop', [1, 5, 9, 13]));
        this.spr.addAnimation(new SpriteAnimation('left', 12, 'loop', [2, 6, 10, 14]));
        this.spr.addAnimation(new SpriteAnimation('right', 12, 'loop', [3, 7, 9, 15]));
        this.spr.setAnimation('down');
        this.spr.play();
        this.spr.properties.ox = 8;
        this.spr.properties.oy = 8;
        const swordSheet = new SpriteSheet(Globals.textureManager.get('slash'), 32, 32);
        this.sword = new AnimatedSprite(swordSheet);
        const swordAnim = new SpriteAnimation('slash', 24, 'once', [0,1,2,3]);
        this.sword.addAnimation(swordAnim);
        this.sword.setAnimation('slash');
        this.sword.play();
        this.sword.properties.ox = 16;
        this.sword.properties.oy = 16;
        this.wand = new Sprite(Globals.textureManager.get('wand'), {oy:2});
    }
    update(dt: number): void {
        if(this.chronoButton.isDown() && this.chronoUseable){
            Globals.timeScale = 0.25;
            this.chrono -= this.chronoDeplete * dt;
            if(this.chrono < 0){
                this.chronoUseable = false;
            }
        }
        else{
            Globals.timeScale = 1;
            if(this.chrono < this.maxChrono){
                this.chrono += this.chronoRegen * dt;
            }
            if(this.chrono >= this.maxChrono){
                this.chrono = this.maxChrono;
                this.chronoUseable = true;
            }
        }
        dt *= Globals.timeScale;
        if(this.fireClock > 0) this.fireClock -= dt;
        if(this.reloadClock > 0) this.reloadClock -= dt;
        if(this.dashClock > 0) this.dashClock -= dt;
        if(this.staminaClock > 0) this.staminaClock -= dt;
        if(this.stamina < this.maxStamina && this.staminaClock <= 0){
            this.stamina += dt * this.staminaRegen;
        }
        if(this.stamina >= this.maxStamina) {
            this.stamina = this.maxStamina;
            this.staminaUsable = true;
        }
        if(this.dashClock <= 0){
            this.velocity = this.move.getValue().mul(this.speed);
        }
        let dir = this.spr.getAnimation();
        if(this.velocity.y > 0) dir = "down";
        else if(this.velocity.y < 0) dir = "up";
        else if(this.velocity.x < 0) dir = "left";
        else if(this.velocity.x > 0) dir = "right";
        if(dir !== this.spr.getAnimation()){
            this.spr.setAnimation(dir);
        }
        if(this.velocity.length()>0 && !this.spr.isPlaying()) this.spr.play();
        if(this.velocity.length()===0 && this.spr.isPlaying()) this.spr.stop();
        if(this.inputMode === 'mk'){
            const pos = Globals.app.getMousePosition().addMutate(this.world.camera.position).subMutate(new Vec2(WIDTH/2, HEIGHT/2)).subMutate(this.position);
            this.aimDir = pos.angle();
        }
        else if(this.inputMode === 'gamepad'){
            if(this.aim.getValue().length()>0) this.aimDir = this.aim.getValue().angle();
        }
        if(this.fireButton.isDown() && this.fireClock <= 0 && this.reloadClock <= 0 && this.magazine > 0){
            const bullet = this.world.playerBullets.getNew() as Bullet;
            const aim = Vec2.fromAngle(this.aimDir);
            bullet.velocity = aim.mul(this.bulletSpeed);
            bullet.position = this.position.copy().addMutate(aim.mul(8));
            this.magazine--;
            this.fireClock = 0.3;
        }
        if(this.reloadButton.isPressed() && this.magazine < this.magCapacity){
            this.reloadClock = 1;
            const missing = this.magCapacity - this.magazine;
            const amount = missing < this.ammo ? missing : this.ammo;
            this.ammo -= amount;
            this.magazine += amount;
        }
        if(this.meleeButton.isPressed()) {
            this.sword.play();
            for (const e of this.world.targets.values()) {
                const ent = e as Actor;
                const diff = ent.position.sub(this.position);
                if(diff.length() > 16) continue;
                const aDiff = angleDiff(diff.angle(), this.aimDir);
                if(Math.abs(aDiff) < 1.5) ent.damage(10);
            }
        }
        if(this.dashButton.isPressed() && this.staminaUsable && this.move.getValue().length() > 0){
            this.stamina -= this.dashCost;
            this.staminaClock = this.staminaDelay;
            this.dashClock = this.dashDuration;
            this.velocity = this.move.getValue().mul(this.dashSpeed);
            if(this.stamina < 0){
                this.stamina = 0;
                this.staminaUsable = false;
            }
        }
        if(this.healButton.isPressed()){
            this.damage(30);
        }
        if(this.spellButton.isPressed()){
            this.mana -= 30;
        }
        this.spr.update(dt);
        this.sword.update(dt);
        super.update(dt);
        // System.println("after", this.velocity.length(), "\n");
        if(Globals.inputManager.getButton("quit").isPressed()) Engine.quit();
    }
    draw(): void {
        this.spr.draw(this.position.x, this.position.y);
        // const pos = Globals.app.getMousePosition().addMutate(this.world.camera.position).subMutate(new Vec2(WIDTH/2, HEIGHT/2));
        const pos = Vec2.fromAngle(this.aimDir).mulMutate(8).addMutate(this.position);
        this.wand.properties.angle = this.aimDir;
        this.wand.draw(pos.x, pos.y);
        this.sword.properties.angle = this.aimDir;
        if(this.sword.isPlaying()) this.sword.draw(this.position.x, this.position.y);
    }
    damage(val: number): void {
        //
        this.health -= val;
        if(this.health <= 0){
            this.health = 0;
            // die
        }
    }
}