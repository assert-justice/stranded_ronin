import { Engine } from "cleo";
import { Globals } from "./game/globals";

Engine.init = () => {
    Globals.init();
};

Engine.update = () => {};
Engine.draw = () => {};
