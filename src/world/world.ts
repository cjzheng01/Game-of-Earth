import { Browser } from "../browser/browser.js";
import { IPosition } from "../common/UI/domNode.js";
import { Entity, EntityType, LivingType, StaticType } from "./entity/entity.js";
import { Bear } from "./entity/bear.js";
import { Human } from "./entity/human.js";
import { Rabbit } from "./entity/rabbit.js";
import { Wolf } from "./entity/wolf.js";
import { Grass } from "./entity/grass.js";
import { Forest } from "./entity/forest.js";
import { Cloud } from "./entity/cloud.js";
import { GameInterface } from "../browser/gameInterface.js";
import { LivingEntity } from "./entity/livingEntity.js";

enum TimeElapseRate {
  ONE = 1,
  TWO,
  THREE,
}

export class World {
  private static readonly INIT_TOTAL_ENTITY_COUNT = 200;

  private readonly _parentContainer: HTMLElement;

  public static entityID: number = 0;
  public static readonly entities: Entity[] = [];

  public static readonly state = {
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

  constructor(parentContainer: HTMLElement) {
    this._parentContainer = parentContainer;
  }

  public run(): void {
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
  private _updateWorld(): void {
    for (const entity of World.entities) {
      entity.update();
    }
  }

  private _initMap(): void {
    // initEntityCounts[i]: i'th entity count
    const initEntityCounts: number[] = [];

    let total = 0;
    for (let i = 0; i < Entity.TOTAL_ENTITY_TYPE - 2; i++) {
      const rate = Math.random();
      total += rate;
      initEntityCounts.push(rate);
    }

    for (let i = 0; i < Entity.TOTAL_ENTITY_TYPE - 2; i++) {
      initEntityCounts[i] = Math.floor(
        (initEntityCounts[i]! / total) * World.INIT_TOTAL_ENTITY_COUNT * 0.3 +
          0.5
      );
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
      for (let j = 0; j < initEntityCounts[i]!; j++) {
        this.createRandomEntity(instantiations[i]!, instantiationsType[i]!);
      }
    }

    for (let i = 0; i < World.INIT_TOTAL_ENTITY_COUNT * 0.4; i++) {
      this.createRandomEntity(Grass, StaticType.GRASS);
    }

    for (let i = 0; i < World.INIT_TOTAL_ENTITY_COUNT * 0.3; i++) {
      this.createRandomEntity(Forest, StaticType.FOREST);
    }
  }

  public createEntity(position: IPosition, type: EntityType): void {
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

  public createRandomEntity(ctor: any, type: EntityType): void {
    let newX!: number;
    let newY!: number;
    let newDimension = Entity.getDimensionByClass(type);

    let isOverLap = false;
    while (isOverLap === false) {
      newX = Browser.size.width * Math.random();
      newY = Browser.size.height * Math.random();

      let isAllChecked = true;
      let entity: Entity;
      for (let k = 0; k < World.entities.length; k++) {
        entity = World.entities[k]!;

        if (
          Entity.isOverlap(
            { x: newX, y: newY },
            entity.position,
            newDimension,
            entity.dimension
          ) === true
        ) {
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

  public printWorldInformation(): void {
    console.log("World.entities: ", World.entities);

    console.log("World.state: ", World.state);
  }
}
