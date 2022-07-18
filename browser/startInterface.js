var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Emitter, sleep } from "../common/event.js";
import { Button } from "../common/UI/button.js";
export class StartInterface {
    constructor(parent) {
        this.parentContainer = parent;
    }
    render() {
        this.container = document.createElement("div");
        this.container.id = "start-interface";
        this.parentContainer.appendChild(this.container);
        this.contentContainer = document.createElement("div");
        this.contentContainer.id = "start-interface-container";
        this.container.appendChild(this.contentContainer);
        // buttons
        const startBtn = new Button("start-button", this.contentContainer);
        startBtn.setClass(["button", "vertical-center", "start-button"]);
        startBtn.setText("Start");
        startBtn.element.setFontSize(20);
        startBtn.addEventListener("click", () => {
            // tell all the listeners the startButton is clicked
            StartInterface._onDidClickStartButton.fire();
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            this.container.removeChild(this.contentContainer);
            this.container.style.backgroundColor = "white";
            yield sleep(1000);
            this.parentContainer.removeChild(this.container);
        });
    }
}
StartInterface._onDidClickStartButton = new Emitter();
StartInterface.onDidClickStartButton = StartInterface._onDidClickStartButton.event;
