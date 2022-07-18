import { StaticType } from "./entity.js";
import { StaticEntity } from "./staticEntity.js";
export class Forest extends StaticEntity {
    constructor(parentContainer, position) {
        super(StaticType.FOREST, position, parentContainer, document.createElement("div"));
        this.parentContainer.appendChild(this.container);
        this._render();
    }
    update() { }
    _render() {
        this.container.classList.add("forest-entity");
        this.container.style.left = this.position.x + "px";
        this.container.style.top = this.position.y + "px";
    }
}
