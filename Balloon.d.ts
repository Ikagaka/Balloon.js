
declare class Balloon {
  constructor(tree: any); // unstable
  load(callback:(error: any) => void): void; // stable
  getSurface(scopeId: number, surfaceId: number): BalloonSurface; // stable
  descript: { [key: string]: string; }; // stable
  tree: any; // unstable
  surfaces: any; // unstable
}

declare module Balloon {
}

declare module 'balloon' {
  var foo: typeof Balloon;
  module rsvp {
    export var Balloon: typeof foo;
  }
  export = rsvp;
}
