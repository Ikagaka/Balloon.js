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
}
