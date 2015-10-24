/// <reference path="../typings/tsd.d.ts"/>

import { Balloon } from "./Balloon";

export declare class Blimp extends EventEmitter2 {
  public element: HTMLDivElement;
  public scopeId: number;
  public balloonId: number;
  public descript: {[key: string]: string};
  public balloon: Balloon;
  public type: string; // sakura|kero
  public isBalloonLeft: boolean;
  public destructed: boolean;
  public width: number;
  public height: number;

  constructor(element: HTMLDivElement, scopeId: number, balloonId: number, balloon: Balloon);
  destructor(): void;
  render(): void;
  location(x: string, y?: string): void;
  left(): void;
  right(): void;
  surface(balloonId: number): void;
  anchorBegin(id: string, ...args: string[]): void;
  anchorEnd(): void;
  choice(text: string, id: string, ...args: string[]): void;
  choiceBegin(id: string, ...args: string[]): void;
  choiceEnd(): void;
  br(ratio: number): void;
  talk(test: string): void;
  marker(): void;
  clear(): void;
  showWait(): void;
  font(name: string, ...values: string[]): void;
  on(event: string, callback: Function): EventEmitter2;
  on(event: "mouse", callback: (ev: BalloonMouseEvent)=>any): EventEmitter2;
  on(event: "select", callback: (ev: BalloonSelectEvent)=>any): EventEmitter2;
}

export interface BalloonEvent {
  type: string;
  scopeId: number; // \p[n]
  balloonId: number; // \b[n]
}

export interface BalloonMouseEvent extends BalloonEvent {
  type: string; // click|dblclikck
}

export interface BalloonSelectEvent extends BalloonEvent {
  type: string; // anchorselect|choiceselect
  id: string;
  text: string;
  args: string[]
}
