import { Window } from "cleo";
import { App } from "./app";
import { InputManager, JoyAxis, Key } from "../libs/core/input_manager";
import { TextureManager } from "../libs/core/texture_manager";

export const WIDTH = 640;
export const HEIGHT = 352;

export class Globals{
    static app: App;
    static inputManager: InputManager;
    static textureManager: TextureManager;
    static init(){
        //
        this.textureManager = new TextureManager();
        this.textureManager.add('player', './sprites/redsamurai.png');
        this.inputManager = new InputManager();
        // configure inputs
        const move = this.inputManager.addAxis2D("move");
        move.xAxis.addKeyNegative(Key.a).addKeyPositive(Key.d).addJoyAxis(0, JoyAxis.lx);
        move.yAxis.addKeyNegative(Key.w).addKeyPositive(Key.s).addJoyAxis(0, JoyAxis.ly);
        const aim = this.inputManager.addAxis2D("aim");
        aim.xAxis.addJoyAxis(0, JoyAxis.rx);
        aim.yAxis.addJoyAxis(0, JoyAxis.ry);
        this.app = new App();
    }
}