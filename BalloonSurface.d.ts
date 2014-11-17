
declare class BalloonSurface {
  constructor(canvas: HTMLCanvasElement, scopeId: number, surfaceId: number, balloons: Balloons); // stable
  destructor(): void; // stable
  render(): void; // stable
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
