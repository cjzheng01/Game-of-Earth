import { FastDomNode } from "./domNode.js";
import { IWidget } from "./widget";

export interface IButton extends IWidget {}

export class Button implements IButton {
  public readonly id: string;
  public element: FastDomNode<HTMLElement>;
  public imgElement?: HTMLImageElement;

  constructor(id: string, container: HTMLElement) {
    this.id = id;
    this.element = new FastDomNode(document.createElement("div"));
    this.element.domNode.id = id;

    container.appendChild(this.element.domNode);
  }

  public setClass(classes: string[]): void {
    this.element.domNode.classList.add(...classes);
  }

  public setImage(src: string): void {
    this.imgElement = document.createElement("img");
    this.imgElement.src = src;

    this.element.domNode.appendChild(this.imgElement);
  }

  public setImageID(id: string): void {
    if (this.imgElement) {
      this.imgElement.id = id;
    }
  }

  public setImageClass(classes: string[]): void {
    if (this.imgElement) {
      this.imgElement.classList.add(...classes);
    }
  }

  public setText(text: string): void {
    this.element.domNode.innerHTML = text;
  }

  public addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.element.domNode.addEventListener(type, listener, options);
  }
}
