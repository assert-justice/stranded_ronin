import { Window } from "cleo";
import { App } from "./app";
import { InputManager, JoyAxis, Key } from "../libs/core/input_manager";

export const WIDTH = 640;
export const HEIGHT = 352;

export class Globals{
    static app: App;
    static inputManager: InputManager;
    static init(){
        //
        this.app = new App();
        this.inputManager = new InputManager();
        // configure inputs
        const move = this.inputManager.addAxis2D("move");
        move.xAxis.addKeyNegative(Key.a).addKeyPositive(Key.d).addJoyAxis(0, JoyAxis.lx);
        move.yAxis.addKeyNegative(Key.w).addKeyPositive(Key.s).addJoyAxis(0, JoyAxis.ly);
        const aim = this.inputManager.addAxis2D("aim");
        aim.xAxis.addJoyAxis(0, JoyAxis.rx);
        aim.yAxis.addJoyAxis(0, JoyAxis.ry);
        // const aim = this.inputManager.addAxis2D("aim");
    }
}