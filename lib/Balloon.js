"use strict";
const ikagaka_shell_js_1 = require("ikagaka.shell.js");
const BalloonSurface_1 = require("./BalloonSurface");
const events_1 = require("events");
const $ = require("jquery");
class Balloon extends events_1.EventEmitter {
    constructor(directory) {
        super();
        this.directory = directory;
        this.descript = {};
        this.attachedBlimp = [];
        this.balloons = {
            sakura: [],
            kero: [],
            communicate: [],
            online: [],
            arrow: [],
            sstp: null,
            thumbnail: null
        };
    }
    load() {
        return Promise.resolve(this)
            .then(() => this.loadDescript()) // 1st
            .then(() => this.loadBalloonSurfaces()) // 2nd
            .then(() => this.loadBalloonDescripts()); // 3rd
    }
    loadDescript() {
        let dir = this.directory;
        let getName = (dic, reg) => Object.keys(dic).filter((name) => reg.test(name))[0] || "";
        let descript_name = getName(dir, /^descript\.txt$/i);
        if (descript_name === "") {
            console.info("descript.txt is not found");
            this.descript = {};
        }
        else {
            this.descript = ikagaka_shell_js_1.SurfaceUtil.parseDescript(ikagaka_shell_js_1.SurfaceUtil.convert(dir[descript_name]));
        }
        return Promise.resolve(this);
    }
    loadBalloonDescripts() {
        let directory = this.directory;
        let balloons = this.balloons;
        let descript = this.descript;
        return new Promise((resolve, reject) => {
            let keys = Object.keys(directory);
            let hits = keys.filter((filepath) => /balloon([sk])(\d+)s\.txt$/.test(filepath));
            hits.forEach((filepath) => {
                let buffer = directory[filepath];
                let _descript = ikagaka_shell_js_1.SurfaceUtil.parseDescript(ikagaka_shell_js_1.SurfaceUtil.convert(buffer));
                let [__, type, n] = /balloon([sk])(\d+)s\.txt$/.exec(filepath);
                $.extend(true, _descript, descript);
                switch (type) {
                    case "s":
                        balloons.sakura[Number(n)].descript = _descript;
                        break;
                    case "k":
                        balloons.kero[Number(n)].descript = _descript;
                        break;
                }
            });
            resolve(this);
        });
    }
    loadBalloonSurfaces() {
        let directory = this.directory;
        let balloons = this.balloons;
        let keys = Object.keys(directory);
        let hits = keys.filter((filepath) => /[^\/]+\.png$/.test(filepath));
        let promises = hits.map((filepath) => {
            let buffer = directory[filepath];
            return ikagaka_shell_js_1.SurfaceUtil.fetchImageFromArrayBuffer(buffer)
                .then((png) => {
                let cnv = ikagaka_shell_js_1.SurfaceUtil.pna({ cnv: null, png, pna: null }).cnv;
                if (/^balloon([ksc])(\d+)\.png$/.test(filepath)) {
                    let [__, type, n] = /^balloon([ksc])(\d+)\.png$/.exec(filepath);
                    switch (type) {
                        case "s":
                            balloons.sakura[Number(n)] = { canvas: cnv, descript: {} };
                            break;
                        case "k":
                            balloons.kero[Number(n)] = { canvas: cnv, descript: {} };
                            break;
                        case "c":
                            balloons.communicate[Number(n)] = { canvas: cnv, descript: {} };
                            break;
                    }
                }
                else if (/^online(\d+)\.png$/.test(filepath)) {
                    let [__, n] = /^online(\d+)\.png$/.exec(filepath);
                    balloons.online[Number(n)] = { canvas: cnv, descript: {} };
                }
                else if (/^arrow(\d+)\.png$/.test(filepath)) {
                    let [__, n] = /^arrow(\d+)\.png$/.exec(filepath);
                    balloons.arrow[Number(n)] = { canvas: cnv, descript: {} };
                }
                else if (/^sstp\.png$/.test(filepath)) {
                    balloons.sstp = { canvas: cnv, descript: {} };
                }
                else if (/^thumbnail\.png$/.test(filepath)) {
                    balloons.thumbnail = { canvas: cnv, descript: {} };
                }
            });
        });
        return new Promise((resolve, reject) => {
            Promise.all(promises).then(() => resolve(this));
        });
    }
    unload() {
        this.attachedBlimp.forEach(({ div, surface }) => surface.destructor());
        this.removeAllListeners();
        Object.keys(this).forEach((key) => this[key] = null);
        return;
    }
    attachBlimp(element, scopeId, balloonId) {
        let type = scopeId === 0 ? "sakura" : "kero";
        if (!(this.balloons[type] != null && this.balloons[type][balloonId] != null)) {
            console.warn("balloon id:", balloonId, "is not defined");
            return null;
        }
        let blimp = new BalloonSurface_1.default(element, scopeId, balloonId, this);
        this.attachedBlimp.push({ surface: blimp, div: element });
        return blimp;
    }
    detachBlimp(element) {
        let hits = this.attachedBlimp.filter((a) => a.div === element);
        if (hits.length === 0) {
            return;
        }
        hits[0].surface.destructor();
        this.attachedBlimp.splice(this.attachedBlimp.indexOf(hits[0]), 1);
        return;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Balloon;
