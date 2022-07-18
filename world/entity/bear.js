import { LivingType } from "./entity.js";
import { LivingEntity, SpeedRate } from "./livingEntity.js";
export class Bear extends LivingEntity {
    constructor(parentContainer, position) {
        super(LivingType.BEAR, position, parentContainer, document.createElement("div"));
        this.eatHumanProb = 0.3;
        this.eatHumanThres = 30;
        this.parentContainer.appendChild(this.container);
        this._render();
    }
    _onHungry() {
        //STATUS : Wandering, need to eat, need to sleep. Hunger > sleep > wandering
        let surds = this._checkSurroundEntity();
        const human = surds.surround.human;
        const wolf = surds.surround.wolf;
        const closestHuman = surds.shortest.human;
        const closestWolf = surds.shortest.wolf;
        if (this.hungry < this.eatHumanThres) {
            if (wolf.length > 0 && human.length > 0) {
                if (Math.random() < this.eatHumanProb) {
                    this._eatOrChase(closestHuman);
                }
                else {
                    this._eatOrChase(closestWolf);
                }
            }
            else if (wolf.length > 0) {
                this.speedrate = SpeedRate.VERY_FAST;
                this._eatOrChase(closestWolf);
            }
            else if (human.length > 0) {
                this.speedrate = SpeedRate.VERY_FAST;
                this._eatOrChase(closestHuman);
            }
            else {
                this.speedrate = SpeedRate.NORMAL;
                this._wander();
            }
        }
        else {
            if (wolf.length > 0) {
                this.speedrate = SpeedRate.FAST;
                this._eatOrChase(closestWolf);
            }
            else {
                this.speedrate = SpeedRate.NORMAL;
                this._wander();
            }
        }
        this._ifDie();
    }
    _render() {
        this.container.classList.add("bear-entity");
        this._moveTo(this.position);
    }
}
