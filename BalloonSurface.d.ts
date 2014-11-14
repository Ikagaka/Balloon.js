
declare class BalloonSurface {
  constructor(scopeId: number, surfaceId: number, balloons: Balloons); // stable
  destructor(): void; // stable
  element: HTMLCanvasElement; // stable
  render(): void; // stable
  playAnimation(): void; // unstable
  stopAnimation(): void; // unstable
}


declare module BalloonSurface {
}

declare module 'balloonsurface' {
  var foo: typeof BalloonSurface;
  module rsvp {
    export var BalloonSurface: typeof foo;
  }
  export = rsvp;
}
