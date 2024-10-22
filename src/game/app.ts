import { Graphics } from "cleo";
import { Game } from "./game";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { WindowDisplay } from "./window_display";

export type AppState = 'menu' | 'map' | 'dialogue' | 'play';

export class App{
    private state: AppState = 'menu';
    game?: Game;
    private bg: Graphics.Texture;
    private wd: WindowDisplay;
    constructor(){
        this.bg = Graphics.Texture.new(WIDTH, HEIGHT);
        this.wd = new WindowDisplay(this.bg);
    }
    setState(state: AppState){
        this.state = state;
        if(state === 'play' && this.game === undefined) this.game = new Game();
    }
    update(dt: number){
        Globals.inputManager.poll();
        if(this.state === 'menu' && Globals.inputManager.getButton("uiSelect").isPressed()) this.setState('play');
        if(this.game !== undefined && this.state === 'play') this.game.update(dt);
    }
    draw(){
        Graphics.pushRenderTarget(this.bg);
        // draw background
        // draw game
        this.game?.draw();
        // draw ui
        Graphics.popRenderTarget();
        this.wd.draw();
    }
}