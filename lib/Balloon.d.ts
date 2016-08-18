import BalloonSurface from "./BalloonSurface";
import { BAL, Descript } from "Interfaces";
import { EventEmitter } from "events";
export default class Balloon extends EventEmitter {
    directory: {
        [key: string]: ArrayBuffer;
    };
    descript: Descript;
    balloons: {
        sakura: BAL[];
        kero: BAL[];
        communicate: BAL[];
        online: BAL[];
        arrow: BAL[];
        sstp: BAL;
        thumbnail: BAL;
    };
    private attachedBlimp;
    constructor(directory: {
        [key: string]: ArrayBuffer;
    });
    load(): Promise<{}>;
    private loadDescript();
    private loadBalloonDescripts();
    private loadBalloonSurfaces();
    unload(): void;
    attachBlimp(element: any, scopeId: any, balloonId: any): BalloonSurface;
    detachBlimp(element: any): void;
}
