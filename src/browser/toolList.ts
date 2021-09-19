import { Emitter } from "../common/event.js";
import { Button } from "../common/UI/button.js";
import { IPosition } from "../common/UI/domNode.js";
import { EntityType, LivingType } from "../world/entity/entity.js";

export interface ICreateEntityEvent {
    type: EntityType;
    position: IPosition;
}

export class ToolList {
    
    public readonly parentContainer: HTMLElement;
    public readonly container: HTMLElement;

    // entity creation emitter
    private static _onCreateEntity = new Emitter<ICreateEntityEvent>();
    public static onCreateEntity = ToolList._onCreateEntity.event;
    
    constructor(parent: HTMLElement) {
        this.parentContainer = parent;
        this.container = document.createElement('div');
        this.container.id = 'tool-list';
    }

    public render(): void {
        this.parentContainer.appendChild(this.container);
        
        const livingContainer = document.createElement('div');
        livingContainer.id = 'living-tool-list';

        const staticContainer = document.createElement('div');
        staticContainer.id = 'static-tool-list';

        this.container.appendChild(staticContainer);
        this.container.appendChild(livingContainer);

        const rabbitBtn = new Button('rabbit-create-button', this.container);
        rabbitBtn.element.domNode.classList.add('tool-button', 'button');

        rabbitBtn.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateEntity.fire({
                type: LivingType.RABBIT, 
                position: {x: ev.x, y: ev.y},
            });
        });

    }

}