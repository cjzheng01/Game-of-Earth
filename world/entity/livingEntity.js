import { calcDistance, getEscapeVec, getRandomInt, } from "../../common/utils/math.js";
import PriorityQueue from "../../common/utils/priorityQueue/PriorityQueue.js";
import { World } from "../world.js";
import { Entity, LivingType, StaticType } from "./entity.js";
export var SpeedRate;
(function (SpeedRate) {
    SpeedRate[SpeedRate["VERY_SLOW"] = 0.5] = "VERY_SLOW";
    SpeedRate[SpeedRate["SLOW"] = 0.75] = "SLOW";
    SpeedRate[SpeedRate["NORMAL"] = 1] = "NORMAL";
    SpeedRate[SpeedRate["FAST"] = 1.25] = "FAST";
    SpeedRate[SpeedRate["VERY_FAST"] = 1.5] = "VERY_FAST";
})(SpeedRate || (SpeedRate = {}));
export var TodoType;
(function (TodoType) {
    TodoType[TodoType["HUNGRY"] = 0] = "HUNGRY";
    TodoType[TodoType["SLEEP"] = 1] = "SLEEP";
    TodoType[TodoType["BEING_CHASE"] = 2] = "BEING_CHASE";
    TodoType[TodoType["REPRODUCE"] = 3] = "REPRODUCE";
})(TodoType || (TodoType = {}));
export class LivingEntity extends Entity {
    constructor(type, position, parentContainer, container) {
        super(type, position, parentContainer, container);
        this.health = 100;
        this.hungry = 100;
        this._energy = 100;
        this.speedrate = 1;
        this.actionRange = Math.max(this.dimension.height, this.dimension.width) / 2;
        this.wandering = false;
        this.wanderFrameCount = 0;
        this.wanderDirection = { dx: 0, dy: 0 };
        this.pq = new PriorityQueue({
            comparator: (a, b) => {
                return a.priority - b.priority;
            },
        });
        this.todoState = {
            hungry: false,
            sleep: false,
            beingChase: false,
            reproduce: false,
        };
        this.state = {
            beingChaseVecsBuffer: [],
            beingChaseVecs: [],
            outOfEnergy: false,
        };
        this.container.classList.add("living-entity");
        this.sightRange = 500;
        switch (type) {
            case LivingType.RABBIT:
                this.speed = 0.4;
                this.healthRestoreRate = 0.05;
                this.hungryRate = 0.01 + 0.01 * Math.random();
                this.energyRate = 0.03 + 0.02 * Math.random();
                break;
            case LivingType.HUMAN:
                this.speed = 0.5;
                this.healthRestoreRate = 0.05;
                this.hungryRate = 0.01 + 0.02 * Math.random();
                this.energyRate = 0.02 + 0.03 * Math.random();
                break;
            case LivingType.WOLF:
                this.speed = 0.6;
                this.healthRestoreRate = 0.05;
                this.hungryRate = 0.02 + 0.01 * Math.random();
                this.energyRate = 0.03 + 0.02 * Math.random();
                break;
            case LivingType.BEAR:
                this.speed = 0.4;
                this.healthRestoreRate = 0.05;
                this.hungryRate = 0.02 + 0.01 * Math.random();
                this.energyRate = 0.02 + 0.03 * Math.random();
                break;
        }
    }
    set energy(val) {
        this._energy = val;
        if (val === 0 && !this.state.outOfEnergy) {
            this.state.outOfEnergy = true;
            setTimeout(() => {
                if (this._energy === 0) {
                    this._goDie();
                }
                else {
                    this.state.outOfEnergy = false;
                }
            }, getRandomInt(3000, 7000));
        }
    }
    get energy() {
        return this._energy;
    }
    update() {
        // detect if hungry
        if (this.hungry < 50 && !this.todoState.hungry) {
            this.pq.queue({
                priority: 1,
                item: TodoType.HUNGRY,
            });
            this.todoState.hungry = true;
        }
        // detect if energy running out
        if (this.energy < 30 && !this.todoState.sleep) {
            this.pq.queue({
                priority: 2,
                item: TodoType.SLEEP,
            });
            this.todoState.sleep = true;
        }
        this._update();
    }
    _update() {
        if (this.pq.length == 0) {
            this._wander();
            this._ifDie();
            return;
        }
        const todo = this.pq.peek();
        switch (todo.item) {
            case TodoType.HUNGRY:
                this._onHungry();
                break;
            case TodoType.SLEEP:
                this._onSleep();
                break;
            case TodoType.BEING_CHASE:
                this._onBeingChase();
                break;
        }
        this.state.beingChaseVecsBuffer.length = 0; // do not touch
    }
    _onSleep() {
        // common method on dealing with running out of energy
        // stopped and starting restoring energy
        this.energy = Math.min(this.energy + this.energyRate, 100);
        this.health = Math.min(this.health + this.healthRestoreRate, 100);
        this.hungry = Math.max(this.hungry - this.hungryRate * 0.3, 0);
        if (this.energy > 80) {
            this.pq.dequeue();
            this.todoState.sleep = false;
        }
    }
    _onBeingChase() {
        if (this.state.beingChaseVecsBuffer.length == 0) {
            //not being chased anymore
            console.log("dequing onBeingChase");
            this.pq.dequeue();
            this.todoState.beingChase = false;
            return;
        }
        this.state.beingChaseVecs = this.state.beingChaseVecsBuffer.slice();
        let escapeDir = getEscapeVec(this.state.beingChaseVecs);
        escapeDir.dx *= this.speed * this.speedrate;
        escapeDir.dy *= this.speed * this.speedrate;
        this._moveInDir(escapeDir);
        this.energy = Math.max(this.energy - this.energyRate, 0);
        this.hungry = Math.max(this.hungry - this.hungryRate, 0);
    }
    /***************************************************************************
     * methods for specific livingEntity to override (end)
     **************************************************************************/
    _eat(entity) {
        Entity.removeEntity(entity);
        this.hungry = 100;
        this.todoState.hungry = false;
        console.log("dequing onEat");
        this.pq.dequeue();
    }
    _eatOrChase(entity) {
        const distance = calcDistance(this.position, entity.position);
        if (distance < Math.max(this.dimension.height, this.dimension.width) / 2) {
            // case when the grass is inside eat range
            this._eat(entity);
        }
        else {
            // case when the grass is outside eat range
            this._chase(entity);
        }
    }
    _ifDie() {
        if (this.hungry <= 0) {
            // hungry detection
            this._goDie();
        }
        else if (this.health <= 0) {
            // health detection
            this._goDie();
        }
    }
    _goDie() {
        const index = World.entities.indexOf(this);
        World.entities.splice(index, 1);
        this.parentContainer.removeChild(this.container);
    }
    _chase(entity) {
        const s = this.speed / calcDistance(this.position, entity.position);
        const dx = s * (entity.position.x - this.position.x);
        const dy = s * (entity.position.y - this.position.y);
        const vect = {
            x: this.position.x + dx,
            y: this.position.y + dy,
        };
        this._moveTo(vect);
        this.energy = Math.max(this.energy - this.energyRate, 0);
        this.hungry = Math.max(this.hungry - this.hungryRate, 0);
        if (entity instanceof LivingEntity) {
            // notify the entity that is being chased
            entity._chaseNotified({ dx: dx, dy: dy });
        }
    }
    _chaseNotified(vector) {
        // if sleeping, the entity will not wake up
        if (!this.todoState.sleep && !this.todoState.beingChase) {
            this.pq.queue({
                priority: 0,
                item: TodoType.BEING_CHASE,
            });
            this.todoState.beingChase = true;
            this.state.beingChaseVecsBuffer.push(vector);
        }
        this.state.beingChaseVecsBuffer.push(vector);
    }
    _moveTo(position) {
        let xPos = position.x;
        let yPos = position.y;
        if (xPos < 15)
            xPos = 15;
        if (yPos < 15)
            yPos = 15;
        if (xPos > window.screen.width - 15)
            xPos = window.screen.width - 15;
        if (yPos > window.screen.height - 15)
            yPos = window.screen.height - 15;
        this.container.style.left = xPos + "px";
        this.container.style.top = yPos + "px";
        this.position.x = xPos;
        this.position.y = yPos;
    }
    _moveInDir(vec) {
        this._moveTo({ x: this.position.x + vec.dx, y: this.position.y + vec.dy });
    }
    _checkSurroundEntity() {
        let shortest = {};
        let shortestDist = {};
        let entities = {
            human: [],
            rabbit: [],
            wolf: [],
            bear: [],
            grass: [],
            cloud: [],
            forest: [],
        };
        const length = World.entities.length;
        for (let i = 0; i < length; i++) {
            const otherEntity = World.entities[i];
            if (this === otherEntity) {
                continue;
            }
            const distance = calcDistance(this.position, otherEntity.position);
            if (distance <= this.sightRange) {
                switch (otherEntity.type) {
                    case LivingType.HUMAN:
                        if (!shortest.human || distance < shortestDist.minHuman) {
                            shortest.human = otherEntity;
                            shortestDist.minHuman = distance;
                        }
                        entities.human.push(otherEntity);
                        break;
                    case LivingType.BEAR:
                        if (!shortest.bear || distance < shortestDist.minBear) {
                            shortest.bear = otherEntity;
                            shortestDist.minBear = distance;
                        }
                        entities.bear.push(otherEntity);
                        break;
                    case LivingType.RABBIT:
                        if (!shortest.rabbit || distance < shortestDist.minRabbit) {
                            shortest.rabbit = otherEntity;
                            shortestDist.minRabbit = distance;
                        }
                        entities.rabbit.push(otherEntity);
                        break;
                    case LivingType.WOLF:
                        if (!shortest.wolf || distance < shortestDist.minWolf) {
                            shortest.wolf = otherEntity;
                            shortestDist.minWolf = distance;
                        }
                        entities.wolf.push(otherEntity);
                        break;
                    case StaticType.CLOUD:
                        if (!shortest.cloud || distance < shortestDist.minCloud) {
                            shortest.cloud = otherEntity;
                            shortestDist.minCloud = distance;
                        }
                        entities.cloud.push(otherEntity);
                        break;
                    case StaticType.FOREST:
                        if (!shortest.forest || distance < shortestDist.minForest) {
                            shortest.forest = otherEntity;
                            shortestDist.minForest = distance;
                        }
                        entities.forest.push(otherEntity);
                        break;
                    case StaticType.GRASS:
                        if (!shortest.grass || distance < shortestDist.minGrass) {
                            shortest.grass = otherEntity;
                            shortestDist.minGrass = distance;
                        }
                        entities.grass.push(otherEntity);
                        break;
                }
            }
        }
        return { shortest: shortest, surround: entities };
        // return entities;
    }
    _wander() {
        this.wandering = true;
        this.wanderFrameCount++;
        if (this.wanderFrameCount > 180 - Math.random() * 120) {
            let xWeight = Math.random() * 10;
            let yWeight = Math.random() * 10;
            let diagLength = Math.sqrt(Math.pow(xWeight, 2) + Math.pow(yWeight, 2));
            let dx = (xWeight / diagLength) * this.speed * this.speedrate;
            let dy = (yWeight / diagLength) * this.speed * this.speedrate;
            if (Math.random() >= 0.5) {
                dx *= -1;
            }
            if (Math.random() >= 0.5) {
                dy *= -1;
            }
            this.wanderDirection = { dx: dx, dy: dy };
            this.wanderFrameCount = 0;
        }
        this._moveInDir(this.wanderDirection);
        this.hungry = Math.max(this.hungry - this.hungryRate, 0);
        this.energy = Math.max(this.energy - this.energyRate, 0);
    }
}
