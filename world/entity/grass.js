import { StaticType } from "./entity.js";
import { StaticEntity } from "./staticEntity.js";
export class Grass extends StaticEntity {
    constructor(parentContainer, position) {
        super(StaticType.GRASS, position, parentContainer, document.createElement("div"));
        this.existTime = 0;
        this.parentContainer.appendChild(this.container);
        this._render();
    }
    update() {
        // this.existTime++;
        // if (this.existTime > 1800) {
        //     // pass life time, destroy self
        //     for(let i = 0; i < World.entities.length; i++) {
        //         if (World.entities[i] == this) {
        //             World.entities.splice(i, 1);
        //             break;
        //         }
        //     }
        // }
    }
    _render() {
        this.container.classList.add("grass-entity");
        this.container.style.left = this.position.x + "px";
        this.container.style.top = this.position.y + "px";
    }
}
