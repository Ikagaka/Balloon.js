import { Descript, Surface } from "Interfaces";
export default class BalloonSurface {
    element: HTMLDivElement;
    scopeId: number;
    balloonId: number;
    balloon: any;
    type: "sakura" | "kero";
    isBalloonLeft: boolean;
    descript: Descript;
    destructed: boolean;
    destructors: Function[];
    insertPoint: JQuery;
    originalInsertPoint: JQuery;
    width: number;
    height: number;
    $blimp: JQuery;
    $blimpCanvas: JQuery;
    $blimpText: JQuery;
    _text_style: {
        [cssprop: string]: string;
    };
    _choice_style: {
        [cssprop: string]: string;
    };
    _choice_notselect_style: {
        [cssprop: string]: string;
    };
    _anchor_style: {
        [cssprop: string]: string;
    };
    _anchor_notselect_style: {
        [cssprop: string]: string;
    };
    _current_text_style: {
        [cssprop: string]: string;
    };
    _current_choice_style: {
        [cssprop: string]: string;
    };
    _current_choice_notselect_style: {
        [cssprop: string]: string;
    };
    _current_anchor_style: {
        [cssprop: string]: string;
    };
    _current_anchor_notselect_style: {
        [cssprop: string]: string;
    };
    currentSurface: Surface;
    constructor(element: HTMLDivElement, scopeId: number, balloonId: number, balloon: any);
    private initDOMStructure();
    private initEventListener();
    private initStyleFromDescript();
    private _blimpTextCSS(styles);
    private _blimpClickableTextCSS(styles, default_styles?);
    private _initializeCurrentStyle();
    private _getFontColor(r, g, b, can_ignore?);
    location(x: string, y: string): void;
    destructor(): void;
    render(): void;
    left(): void;
    right(): void;
    surface(balloonId: number): void;
    anchorBegin(id: string, ...args: string[]): void;
    anchorEnd(): void;
    choice(text: string, id: string, ...args: string[]): void;
    choiceBegin(id: string, ...args: string[]): void;
    choiceEnd(): void;
    talk(text: string): void;
    talkraw(text: string): void;
    marker(): void;
    clear(): void;
    br(ratio: number): void;
    showWait(): void;
    font(name: string, ...values: any[]): void;
}
