import { World } from "../world/world.js";
import { ToolList } from "./toolList.js";
export class GameInterface {
    constructor(parent) {
        this.parentContainer = parent;
        this.container = document.createElement("div");
        this.container.id = "game-interface";
        this.world = new World(this.container);
    }
    render() {
        this.parentContainer.appendChild(this.container);
        this.renderCurrentTime();
        this.renderToolList();
        this.registerListeners();
        this.runGame();
    }
    registerListeners() {
        // listen to the emitter
        ToolList.onCreateEntity((event) => {
            this.world.createEntity(event.position, event.type);
        });
    }
    renderCurrentTime() {
        GameInterface.currTimeElement = document.createElement("div");
        GameInterface.currTimeElement.id = "current-time";
        GameInterface.currTimeElement.classList.add("pure-text");
        GameInterface.updateCurrentTime();
        this.container.appendChild(GameInterface.currTimeElement);
    }
    static updateCurrentTime() {
        GameInterface.currTimeCount++;
        GameInterface.currTimeElement.innerHTML =
            Math.floor(GameInterface.currTimeCount / 60) +
                " : " +
                (GameInterface.currTimeCount % 60);
    }
    renderToolList() {
        GameInterface.toolList = new ToolList(this.container);
        GameInterface.toolList.render();
    }
    runGame() {
        this.world.run();
    }
    destroy() {
        this.parentContainer.removeChild(this.container);
    }
}
GameInterface.currTimeCount = -1;
