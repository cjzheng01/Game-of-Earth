import { IPosition } from "../../common/UI/domNode.js";
import { LivingType } from "./entity.js";
import { LivingEntity } from "./livingEntity.js";

export class Wolf extends LivingEntity {
    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.HUMAN, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    public override update(): void {
        // TODO
    }

    protected override _render(): void {

        this.container.classList.add('wolf-entity');
        this._moveTo(this.position);

    }
}
