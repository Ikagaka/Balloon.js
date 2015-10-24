# Balloon.js

[![npm](https://img.shields.io/npm/v/ikagaka.balloon.js.svg?style=flat)](https://npmjs.com/package/ikagaka.balloon.js)

Ukagaka Balloon Surface Renderer for Web Browser

## About
Balloon.js is a `Ukagaka` compatible Balloon Shell renderer for HTML canvas.
<!---
* [demo](https://ikagaka.github.io/Balloon.js/demo/playground.html)
-->

## Dependence
* [asyncly/EventEmitter2](https://github.com/asyncly/EventEmitter2)
* [Stuk/jszip](https://github.com/Stuk/jszip)
* [Ikagaka/NarLoader](https://github.com/Ikagaka/NarLoader/)
* [polygonplanet/encoding.js](https://github.com/polygonplanet/encoding.js)
* [jquery/jquery](https://github.com/jquery/jquery)

## Usage

```html
<script src="../bower_components/encoding-japanese/encoding.js"></script>
<script src="../bower_components/jszip/dist/jszip.min.js"></script>
<script src="../bower_components/eventemitter2/lib/eventemitter2.js"></script>
<script src="../bower_components/jquery/dist/jquery.min.js"></script>
<script src="../bower_components/narloader/NarLoader.js"></script>
<script src="../dist/Balloon.js"></script>
<script>
NarLoader
.loadFromURL("../nar/origin.nar")
.then(function(nanikaDir){
  console.log(nanikaDir.files);
  var balloonDir = nanikaDir.asArrayBuffer();
  var balloon = new Balloon.Balloon(balloonDir);
  return balloon.load();
}).then(function(balloon){
  console.log(balloon);
  var div = document.createElement("div");
  var scopeId = 0;
  var surfaceId = 0;
  balloon.attachBlimp(div, scopeId, surfaceId);
  document.body.appendChild(div);
}).catch(function(err){
  console.error(err);
});
```

## Development

```sh
npm install -g bower dtsm http-server coffeescript browserify
npm run init
npm run build
```

## Document
* 型はTypeScriptで、サンプルコードはCoffeeScriptで書かれています。


### Balloon Class
#### load(directory: { [path: string]: ArrayBuffer; }): Promise<Shell>
#### unload(): void
#### descript: { [key: string]: string; }
#### attatchSurface(element: HTMLDivElement, scoepId: number, blimpId: number|string): BalloonSurface|null
* blimpId: バルーンサーフェスID
  * 0の時、左側通常バルーン
  * 1の時、右側通常バルーン
  * 2の時、右側大きなバルーン
  * 3の時、左側大きなバルーン

#### detachSurface(element: HTMLDivElement): void
#### on(event: string, callback: (event: BalloonEvent)=> void): void
* `on(event: "mouse", callback: (ev: BalloonMouseEvent)=>void): void`
* `on(event: "select", callback: (ev: BalloonSelectEvent)=>void): void`

```typescript
interface BalloonEvent {
  type: string;
  scopeId: number; // \p[n]
  balloonId: number; // \b[n]
}

interface BalloonMouseEvent extends BalloonEvent {
  type: string; // click|dblclikck
}

interface BalloonSelectEvent extends BalloonEvent {
  type: string; // anchorselect|choiceselect
  id: string;
  text: string;
  args: string[]
}
```

### BalloonSurface Class
#### element: HTMLDivElement
* attatchSurfaceで指定したDiv要素です。
* 以下のように要素が追加されます
  ```jade
  div.blimp
    canvas.blimpCanvas
    div.blimpText
    style[scoepd]
  ```
#### isBalloonLeft: boolean
#### render(): void
* バルーンを再描画します

#### surface(balloonId: number): void
* [`\b[n]`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#_b_ID番号_)
* このメソッドを使ってもバルーンの左右位置は変えられません。
* `Blimp#left()`, `Blimp#rihgt()`を使ってください。

#### left(): void
* バルーンを左向き表示にします

#### right(): void
* バルーンを右向き表示にします

#### anchorBegin(id: string, ...args: string[]): void
* [`\_a[anchorId]`, `\_a[anchorId,...]`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#__a_ID_)

#### anchorEnd(): void
* [`\_a`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#__a_ID_)

#### choice(text: string, id: string, ...args: string[]): void
* [`\q[label, choiceId] \q[label, choiceId, ...]`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#_q_タイトル,ID_)

#### choiceBegin(id: string, ...args: string)[]: void
* [`\__q[choiceId] \__q[choiceId,...]`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#___q_ID,..._)

#### choiceEnd(): void
* [`\__q`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#___q_ID,..._)

#### talk(test: string): void
* バルーンの現在のカーソル位置に文字を追加します

#### marker(): void
* [`\![*]`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#_!_*_)

#### clear(): void
* [`\c`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#_c)

#### br(ratio: number): void
* [`\n`, `\n[half]`, `\n[ratio]`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#_n)

#### showWait(): void
* [`\x`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#_x)

#### font(name: string, ...values: string[]): void
* [`\f[]`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#_f_cursorstyle,形状_)

#### location( x: string, y?: string ): void
* [`\_l[x,y]`](http://ssp.shillest.net/ukadoc/manual/list_sakura_script.html#__l_x,y_)
