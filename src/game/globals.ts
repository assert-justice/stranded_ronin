import { Input, Window } from "cleo";
import { App } from "./app";
import { InputManager, JoyAxis, JoyButton, Key } from "../libs/core/input_manager";
import { TextureManager } from "../libs/core/texture_manager";
import { TileSprite } from "../libs/core/tile_sprite";

export const WIDTH = 640;
export const HEIGHT = 352;

export class Globals{
    static app: App;
    static inputManager: InputManager;
    static textureManager: TextureManager;
    static fontSpr: TileSprite;
    static init(){
        this.textureManager = new TextureManager();
        this.textureManager.add('player', './sprites/redsamurai.png');
        this.textureManager.add('target', './sprites/eye.png');
        this.textureManager.add('shuriken', './sprites/shuriken.png');
        this.textureManager.add('font', './sprites/big_font.png');
        this.textureManager.add('slash', './sprites/slash.png');
        this.fontSpr = new TileSprite(this.textureManager.get('font'), 10, 14);
        this.inputManager = new InputManager();
        // configure inputs
        const move = this.inputManager.addAxis2D("move");
        move.xAxis.addKeyNegative(Key.a).addKeyPositive(Key.d).addJoyAxis(0, JoyAxis.lx);
        move.yAxis.addKeyNegative(Key.w).addKeyPositive(Key.s).addJoyAxis(0, JoyAxis.ly);
        const aim = this.inputManager.addAxis2D("aim");
        aim.xAxis.addJoyAxis(0, JoyAxis.rx);
        aim.yAxis.addJoyAxis(0, JoyAxis.ry);
        this.inputManager.addButton("fire").addMouseButton(1).addInput(()=>Input.joyGetAxis(0, JoyAxis.rt) > 0);
        this.inputManager.addButton("melee").addMouseButton(0).addJoyButton(0, JoyButton.rb);
        this.inputManager.addButton("reload").addKey(Key.r).addJoyButton(0, JoyButton.x);
        this.inputManager.addButton("use").addKey(Key.e).addJoyButton(0, JoyButton.a);
        this.inputManager.addButton("dash").addKey(Key.space).addJoyButton(0, JoyButton.lb);
        this.inputManager.addButton("quit").addKey(Key.escape).addJoyButton(0, JoyButton.start);
        this.app = new App();
    }
}