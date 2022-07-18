import { GameInterface } from "./gameInterface.js";
import { StartInterface } from "./startInterface.js";
import { ToolList } from "./toolList.js";
export class Browser {
    constructor() {
        this.mainContainer = document.getElementById("main-app");
        this.registerListeners();
        this.init();
    }
    /**
     * @description renders and initializes the start interface.
     */
    init() {
        this.startInterface = new StartInterface(this.mainContainer);
        this.startInterface.render();
        StartInterface.onDidClickStartButton(() => {
            this.startInterface.destroy().then(() => {
                this.gameInterface = new GameInterface(this.mainContainer);
                this.gameInterface.render();
            });
        });
    }
    registerListeners() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                ToolList.removeListeners();
            }
        });
    }
}
Browser.size = {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
};
