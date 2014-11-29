interface Descript { [key: string]: string; };

interface Balloons {
  sakura:     {descript: Descript; canvas: HTMLCanvasElement; }[];
  kero:       {descript: Descript; canvas: HTMLCanvasElement; }[];
  communicate:{descript: Descript; canvas: HTMLCanvasElement; }[];
  online:     {descript: Descript; canvas: HTMLCanvasElement; }[];
  arrow:      {descript: Descript; canvas: HTMLCanvasElement; }[];
  sstp:       {descript: Descript; canvas: HTMLCanvasElement; }[];
  thumbnail:  {descript: Descript; canvas: HTMLCanvasElement; }[];
}

declare class Balloon {
  constructor(directory: { [filePath: string]: JSZipObject; });
  load(callback:(error: any) => void): void;
  attachSurface(canvas: HTMLCanvasElement, scopeId: number, surfaceId: number): BalloonSurface;
  descript: Descript;
  balloons: Balloons;
}
