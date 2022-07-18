import { Browser } from "../browser/browser.js";
import { Entity, LivingType, StaticType } from "./entity/entity.js";
import { Bear } from "./entity/bear.js";
import { Human } from "./entity/human.js";
import { Rabbit } from "./entity/rabbit.js";
import { Wolf } from "./entity/wolf.js";
import { Grass } from "./entity/grass.js";
import { Forest } from "./entity/forest.js";
import { Cloud } from "./entity/cloud.js";
import { GameInterface } from "../browser/gameInterface.js";
var TimeElapseRate;
(function (TimeElapseRate) {
    TimeElapseRate[TimeElapseRate["ONE"] = 1] = "ONE";
    TimeElapseRate[TimeElapseRate["TWO"] = 2] = "TWO";
    TimeElapseRate[TimeElapseRate["THREE"] = 3] = "THREE";
})(TimeElapseRate || (TimeElapseRate = {}));
export class World {
    constructor(parentContainer) {
        this._parentContainer = parentContainer;
    }
    run() {
        this._initMap();
        // main loop
        setInterval(() => {
            this._updateWorld();
        }, (1 / (60 * World.state.TimeElapseRate)) * 1000);
        // update time for each second
        setInterval(() => {
            GameInterface.updateCurrentTime();
        }, 1000 / World.state.TimeElapseRate);
    }
    /**
     * @description update the game data for 'each frame'.
     */
    _updateWorld() {
        for (const entity of World.entities) {
            entity.update();
        }
    }
    _initMap() {
        // initEntityCounts[i]: i'th entity count
        const initEntityCounts = [];
        let total = 0;
        for (let i = 0; i < Entity.TOTAL_ENTITY_TYPE - 2; i++) {
            const rate = Math.random();
            total += rate;
            initEntityCounts.push(rate);
        }
        for (let i = 0; i < Entity.TOTAL_ENTITY_TYPE - 2; i++) {
            initEntityCounts[i] = Math.floor((initEntityCounts[i] / total) * World.INIT_TOTAL_ENTITY_COUNT * 0.3 +
                0.5);
        }
        const instantiations = [Human, Rabbit, Wolf, Bear, Cloud];
        const instantiationsType = [
            LivingType.HUMAN,
            LivingType.RABBIT,
            LivingType.WOLF,
            LivingType.BEAR,
            StaticType.CLOUD,
        ];
        for (let i = 0; i < initEntityCounts.length; i++) {
            for (let j = 0; j < initEntityCounts[i]; j++) {
                this.createRandomEntity(instantiations[i], instantiationsType[i]);
            }
        }
        for (let i = 0; i < World.INIT_TOTAL_ENTITY_COUNT * 0.4; i++) {
            this.createRandomEntity(Grass, StaticType.GRASS);
        }
        for (let i = 0; i < World.INIT_TOTAL_ENTITY_COUNT * 0.3; i++) {
            this.createRandomEntity(Forest, StaticType.FOREST);
        }
    }
    createEntity(position, type) {
        switch (type) {
            case LivingType.HUMAN:
                new Human(this._parentContainer, position);
                break;
            case LivingType.RABBIT:
                new Rabbit(this._parentContainer, position);
                break;
            case LivingType.WOLF:
                new Wolf(this._parentContainer, position);
                break;
            case LivingType.BEAR:
                new Bear(this._parentContainer, position);
                break;
            case StaticType.CLOUD:
                new Cloud(this._parentContainer, position);
                break;
            case StaticType.FOREST:
                new Forest(this._parentContainer, position);
                break;
            case StaticType.GRASS:
                new Grass(this._parentContainer, position);
                break;
        }
    }
    createRandomEntity(ctor, type) {
        let newX;
        let newY;
        let newDimension = Entity.getDimensionByClass(type);
        let isOverLap = false;
        while (isOverLap === false) {
            newX = Browser.size.width * Math.random();
            newY = Browser.size.height * Math.random();
            let isAllChecked = true;
            let entity;
            for (let k = 0; k < World.entities.length; k++) {
                entity = World.entities[k];
                if (Entity.isOverlap({ x: newX, y: newY }, entity.position, newDimension, entity.dimension) === true) {
                    isAllChecked = false;
                    break;
                }
            }
            if (isAllChecked) {
                isOverLap = true;
            }
        }
        new ctor(this._parentContainer, { x: newX, y: newY });
    }
    printWorldInformation() {
        console.log("World.entities: ", World.entities);
        console.log("World.state: ", World.state);
    }
}
World.INIT_TOTAL_ENTITY_COUNT = 200;
World.entityID = 0;
World.entities = [];
World.state = {
    count: {
        rabbit: 0,
        human: 0,
        wolf: 0,
        bear: 0,
        grass: 0,
        cloud: 0,
        forest: 0,
    },
    currTime: 0,
    TimeElapseRate: TimeElapseRate.ONE,
};
