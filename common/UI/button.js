import { FastDomNode } from "./domNode.js";
export class Button {
    constructor(id, container) {
        this.id = id;
        this.element = new FastDomNode(document.createElement("div"));
        this.element.domNode.id = id;
        container.appendChild(this.element.domNode);
    }
    setClass(classes) {
        this.element.domNode.classList.add(...classes);
    }
    setImage(src) {
        this.imgElement = document.createElement("img");
        this.imgElement.src = src;
        this.element.domNode.appendChild(this.imgElement);
    }
    setImageID(id) {
        if (this.imgElement) {
            this.imgElement.id = id;
        }
    }
    setImageClass(classes) {
        if (this.imgElement) {
            this.imgElement.classList.add(...classes);
        }
    }
    setText(text) {
        this.element.domNode.innerHTML = text;
    }
    addEventListener(type, listener, options) {
        this.element.domNode.addEventListener(type, listener, options);
    }
}
