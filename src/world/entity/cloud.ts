import { IPosition } from "../../common/UI/domNode.js";
import { StaticType } from "./entity.js";
import { StaticEntity } from "./staticEntity.js";

export class Cloud extends StaticEntity {
  constructor(parentContainer: HTMLElement, position: IPosition) {
    super(
      StaticType.CLOUD,
      position,
      parentContainer,
      document.createElement("div")
    );
    this.parentContainer.appendChild(this.container);
    this._render();
  }

  public override update(): void {
    const dx = 20 * (Math.random() - 0.5) * 2;
    const dy = 20 * (Math.random() - 0.5) * 2;
    this.position.x += dx;
    this.position.y += dy;
  }

  protected override _render(): void {
    this.container.classList.add("cloud-entity");

    this.container.style.left = this.position.x + "px";
    this.container.style.top = this.position.y + "px";
  }
}
