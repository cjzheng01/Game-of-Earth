import { Entity } from "./entity.js";
export class StaticEntity extends Entity {
    constructor(type, position, parentContainer, container) {
        super(type, position, parentContainer, container);
        this.container.classList.add("static-entity");
    }
}
