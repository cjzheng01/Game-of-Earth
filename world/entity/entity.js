import { Dimension } from "../../common/UI/domNode.js";
import { World } from "../world.js";
export var LivingType;
(function (LivingType) {
    LivingType[LivingType["HUMAN"] = 0] = "HUMAN";
    LivingType[LivingType["RABBIT"] = 1] = "RABBIT";
    LivingType[LivingType["WOLF"] = 2] = "WOLF";
    LivingType[LivingType["BEAR"] = 3] = "BEAR";
})(LivingType || (LivingType = {}));
export var StaticType;
(function (StaticType) {
    StaticType[StaticType["GRASS"] = 4] = "GRASS";
    StaticType[StaticType["CLOUD"] = 5] = "CLOUD";
    StaticType[StaticType["FOREST"] = 6] = "FOREST";
})(StaticType || (StaticType = {}));
export class Entity {
    constructor(type, position, parentContainer, container) {
        this.id = World.entityID++;
        this.type = type;
        this.position = position;
        this.parentContainer = parentContainer;
        this.container = container;
        this.container.classList.add("entity");
        /**
         * @readonly hovering create name tag
         */
        this.container.addEventListener("mouseenter", () => {
            Entity.createEntityTag(this);
        });
        this.container.addEventListener("mouseout", () => {
            Entity.removeEntityTag(this);
        });
        /**
         * @readonly maintains the state of World
         */
        World.entities.push(this);
        switch (type) {
            case LivingType.RABBIT:
                World.state.count.rabbit++;
                this.dimension = new Dimension(30, 30);
                break;
            case LivingType.HUMAN:
                World.state.count.human++;
                this.dimension = new Dimension(30, 30);
                break;
            case LivingType.WOLF:
                World.state.count.wolf++;
                this.dimension = new Dimension(30, 30);
                break;
            case LivingType.BEAR:
                World.state.count.bear++;
                this.dimension = new Dimension(30, 30);
                break;
            case StaticType.GRASS:
                World.state.count.grass++;
                this.dimension = new Dimension(20, 20);
                break;
            case StaticType.CLOUD:
                World.state.count.cloud++;
                this.dimension = new Dimension(0, 0);
                break;
            case StaticType.FOREST:
                World.state.count.forest++;
                this.dimension = new Dimension(30, 30);
                break;
        }
    }
    static isOverlap(p1, p2, d1, d2) {
        let mlx = p1.x;
        let mly = p1.y;
        let mrx = p1.x + d1.width;
        let mry = p1.y + d1.height;
        let nlx = p2.x;
        let nly = p2.y;
        let nrx = p2.x + d2.width;
        let nry = p2.y + d2.height;
        if (mlx > nrx || nlx > mrx) {
            return false;
        }
        if (mry < nly || nry < mly) {
            return false;
        }
        return true;
    }
    static getDimensionByClass(type) {
        switch (type) {
            case LivingType.HUMAN:
            case LivingType.RABBIT:
            case LivingType.WOLF:
            case LivingType.BEAR:
                return { width: 30, height: 30 };
            case StaticType.GRASS:
                return { width: 20, height: 20 };
            case StaticType.CLOUD:
                return { width: -1, height: -1 };
            case StaticType.FOREST:
                return { width: 30, height: 30 };
        }
    }
    static createEntityTag(entity) {
        Entity.nameTagContainer = document.createElement("div");
        Entity.nameTagContainer.style.left = "45%";
        Entity.nameTagContainer.style.top = "10px";
        Entity.nameTagContainer.id = "entity-name-tag";
        Entity.nameTagContainer.innerHTML = Entity.getEntityTypeName(entity.type);
        entity.parentContainer.appendChild(Entity.nameTagContainer);
        Entity.InfoContainer = document.createElement("div");
        Entity.InfoContainer.style.right = "5%";
        Entity.InfoContainer.style.bottom = "10px";
        Entity.InfoContainer.id = "entity-info-container";
        [
            { tagName: "health", value: entity.health },
            { tagName: "hungry", value: entity.hungry },
            { tagName: "energy", value: entity.energy },
        ].forEach(({ tagName, value }) => {
            const tag = document.createElement("div");
            tag.classList.add("entity-info-tag-container");
            const tagNameElement = document.createElement("div");
            tagNameElement.classList.add("entity-info-tag-name");
            tagNameElement.innerHTML = tagName;
            const tagValueElement = document.createElement("div");
            tagValueElement.classList.add("entity-info-tag-value");
            tagValueElement.innerHTML = Math.round(value).toString();
            tag.appendChild(tagNameElement);
            tag.appendChild(tagValueElement);
            Entity.InfoContainer.appendChild(tag);
        });
        entity.parentContainer.appendChild(Entity.InfoContainer);
    }
    static removeEntityTag(entity) {
        entity.parentContainer.removeChild(Entity.nameTagContainer);
        entity.parentContainer.removeChild(Entity.InfoContainer);
    }
    static getEntityTypeName(entity) {
        switch (entity) {
            case LivingType.HUMAN:
                return "Human";
            case LivingType.RABBIT:
                return "Rabbit";
            case LivingType.WOLF:
                return "Wolf";
            case LivingType.BEAR:
                return "Bear";
            case StaticType.CLOUD:
                return "Cloud";
            case StaticType.GRASS:
                return "Grass";
            case StaticType.FOREST:
                return "Tree";
        }
    }
    static removeEntity(entity, index) {
        if (index === undefined) {
            index = World.entities.indexOf(entity);
            if (index === undefined) {
                throw "cannot find entity to be removed";
            }
        }
        World.entities.splice(index, 1);
        entity.parentContainer.removeChild(entity.container);
    }
}
Entity.TOTAL_ENTITY_TYPE = 7;
