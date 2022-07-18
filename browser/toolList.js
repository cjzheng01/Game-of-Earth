import { Emitter } from "../common/event.js";
import { Button } from "../common/UI/button.js";
import { LivingType, StaticType } from "../world/entity/entity.js";
export class ToolList {
    constructor(parent) {
        this.parentContainer = parent;
        this.container = document.createElement("div");
        this.container.id = "tool-list";
        ToolList.cursor.id = "cursor";
    }
    render() {
        this.parentContainer.appendChild(this.container);
        const livingContainer = document.createElement("div");
        livingContainer.id = "living-tool-list";
        const staticContainer = document.createElement("div");
        staticContainer.id = "static-tool-list";
        this.container.appendChild(staticContainer);
        this.container.appendChild(livingContainer);
        /***********************************************************************
         * LivingEntity Creation Button
         **********************************************************************/
        const rabbitBtn = new Button("rabbit-create-button", livingContainer);
        rabbitBtn.setImage("../../src/assets/rabbit.png");
        rabbitBtn.setImageClass(["tool-button-img"]);
        rabbitBtn.element.domNode.classList.add("tool-button", "button");
        rabbitBtn.addEventListener("click", (ev) => {
            ToolList.updateCursor(LivingType.RABBIT);
        });
        const humanBtn = new Button("human-create-button", livingContainer);
        humanBtn.setImage("../../src/assets/human.png");
        humanBtn.setImageClass(["tool-button-img"]);
        humanBtn.element.domNode.classList.add("tool-button", "button");
        humanBtn.addEventListener("click", (ev) => {
            ToolList.updateCursor(LivingType.HUMAN);
        });
        const wolfBtn = new Button("wolf-create-button", livingContainer);
        wolfBtn.setImage("../../src/assets/wolf.png");
        wolfBtn.setImageClass(["tool-button-img"]);
        wolfBtn.element.domNode.classList.add("tool-button", "button");
        wolfBtn.addEventListener("click", (ev) => {
            ToolList.updateCursor(LivingType.WOLF);
        });
        const bearBtn = new Button("bear-create-button", livingContainer);
        bearBtn.setImage("../../src/assets/bear.png");
        bearBtn.setImageClass(["tool-button-img"]);
        bearBtn.element.domNode.classList.add("tool-button", "button");
        bearBtn.addEventListener("click", (ev) => {
            ToolList.updateCursor(LivingType.BEAR);
        });
        /***********************************************************************
         * StaticEntity Creation Button
         **********************************************************************/
        const grass = new Button("grass-create-button", staticContainer);
        grass.setImage("../../src/assets/grass.png");
        grass.setImageClass(["tool-button-img"]);
        grass.element.domNode.classList.add("tool-button", "button");
        grass.addEventListener("click", (ev) => {
            ToolList.updateCursor(StaticType.GRASS);
        });
        const forest = new Button("forest-create-button", staticContainer);
        forest.setImage("../../src/assets/tree.png");
        forest.setImageClass(["tool-button-img"]);
        forest.element.domNode.classList.add("tool-button", "button");
        forest.addEventListener("click", (ev) => {
            ToolList.updateCursor(StaticType.FOREST);
        });
        // const cloud = new Button('cloud-create-button', staticContainer);
        // cloud.setImage('../../src/assets/cloud.png');
        // cloud.setImageClass(['tool-button-img']);
        // cloud.element.domNode.classList.add('tool-button', 'button');
        // cloud.addEventListener('click', (ev: MouseEvent) => {
        //     ToolList.updateCursor(StaticType.CLOUD);
        // });
    }
    static registerListeners(type) {
        document.body.appendChild(ToolList.cursor);
        $("#cursor").removeClass();
        ToolList.addCursorClassByType(type);
        ToolList.currentType = type;
        document.addEventListener("mousemove", cursorFollow);
        ToolList.cursor.addEventListener("click", fireToolListClick);
    }
    static removeListeners() {
        document.body.removeChild(ToolList.cursor);
        document.removeEventListener("mousemove", cursorFollow);
        ToolList.cursor.removeEventListener("mousemove", fireToolListClick);
    }
    static updateCursor(type) {
        ToolList.selectingIcon = true;
        ToolList.registerListeners(type);
    }
    static addCursorClassByType(type) {
        switch (type) {
            case LivingType.RABBIT:
                ToolList.cursor.classList.add("cursor-rabbit");
                break;
            case LivingType.HUMAN:
                ToolList.cursor.classList.add("cursor-human");
                break;
            case LivingType.WOLF:
                ToolList.cursor.classList.add("cursor-wolf");
                break;
            case LivingType.BEAR:
                ToolList.cursor.classList.add("cursor-bear");
                break;
            case StaticType.GRASS:
                ToolList.cursor.classList.add("cursor-grass");
                break;
            case StaticType.FOREST:
                ToolList.cursor.classList.add("cursor-forest");
                break;
            case StaticType.CLOUD:
                ToolList.cursor.classList.add("cursor-cloud");
                break;
        }
    }
}
ToolList.selectingIcon = false;
ToolList.cursor = document.createElement("div");
// entity creation emitter
ToolList._onCreateEntity = new Emitter();
ToolList.onCreateEntity = ToolList._onCreateEntity.event;
function cursorFollow(e) {
    ToolList.cursor.setAttribute("style", "top: " +
        (e.pageY - 30 / 2) +
        "px; " +
        "left: " +
        (e.pageX - 30 / 2) +
        "px;");
}
function fireToolListClick(e) {
    ToolList._onCreateEntity.fire({
        type: ToolList.currentType,
        position: { x: e.x, y: e.y },
    });
}
