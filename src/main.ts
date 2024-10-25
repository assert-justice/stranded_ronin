import { Engine, Window } from "cleo";
import { Globals } from "./game/globals";

Window.setStats("Stranded Ronin", 1920, 1080);

Engine.init = () => {
    Globals.init();
};

Engine.update = (dt: number) => {
    Globals.app.update(dt);
};
Engine.draw = () => {
    Globals.app.draw();
};
