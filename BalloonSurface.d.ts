
declare class BalloonSurface {
  constructor(scopeId: number, srf: any, surfaces: any); // unstable
  destructor(): void; // stable
  element: HTMLCanvasElement; // stable
  render(): void; // stable
  playAnimation(animationId, callback: () => void): void; // stable
  stopAnimation(): void; // stable
}


declare module BalloonSurface {
  function random(callback: (callback: () => void) => void, probability: Number): void; // stable
  function periodic(callback: (callback: () => void) => void, sec: Number): void; // stable
  function always(callback: (callback: () => void) => void): void; // stable
  function isHit(cnv: HTMLCanvasElement, x: number, y: number ): boolean; // stable
}

declare module 'balloonsurface' {
  var foo: typeof BalloonSurface;
  module rsvp {
    export var BalloonSurface: typeof foo;
  }
  export = rsvp;
}
