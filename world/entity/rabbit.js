import { LivingType } from "./entity.js";
import { LivingEntity } from "./livingEntity.js";
export class Rabbit extends LivingEntity {
    constructor(parentContainer, position) {
        super(LivingType.RABBIT, position, parentContainer, document.createElement("div"));
        this.parentContainer.appendChild(this.container);
        this._render();
    }
    _onHungry() {
        const surds = this._checkSurroundEntity();
        const grass = surds.surround.grass;
        const closestGrass = surds.shortest.grass;
        if (grass.length) {
            this._eatOrChase(closestGrass);
        }
        else {
            this._wander();
        }
        this._ifDie();
    }
    _render() {
        this.container.classList.add("rabbit-entity");
        this._moveTo(this.position);
    }
}
