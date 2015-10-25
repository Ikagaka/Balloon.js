/// <reference path="../typings/tsd.d.ts"/>

import { Blimp } from "./Blimp";

interface Descript {
  [key: string]: string
}

export interface Balloons {
  sakura:     {descript: Descript; canvas: HTMLCanvasElement; }[];
  kero:       {descript: Descript; canvas: HTMLCanvasElement; }[];
  communicate:{descript: Descript; canvas: HTMLCanvasElement; }[];
  online:     {descript: Descript; canvas: HTMLCanvasElement; }[];
  arrow:      {descript: Descript; canvas: HTMLCanvasElement; }[];
  sstp:       {descript: Descript; canvas: HTMLCanvasElement; }[];
  thumbnail:  {descript: Descript; canvas: HTMLCanvasElement; }[];
}

export declare class Balloon extends EventEmitter2 {
  public directory: { [path: string]: ArrayBuffer; };
  public descript: Descript;
  public balloons: Balloons;
  private attachedSurface: {blimp:Blimp, element:HTMLDivElement}[];

  constructor(directory: { [path: string]: ArrayBuffer; });
  public load(): Promise<Balloon>;
  public unload(): void;
  public attachBlimp(element: HTMLDivElement, scopeId: number, balloonId: number): Blimp;
  public detachBlimp(element: HTMLDivElement): void;
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
  args: string[];
}

export interface BalloonInputEvent extends BalloonEvent {
  type: string; // userinput|communicateinput
  id: string;
  content: string;
}
