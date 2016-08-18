"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ikagaka_shell_js_1 = require("ikagaka.shell.js");
var BalloonSurface_1 = require("./BalloonSurface");
var events_1 = require("events");
var $ = require("jquery");

var Balloon = function (_events_1$EventEmitte) {
    _inherits(Balloon, _events_1$EventEmitte);

    function Balloon(directory) {
        _classCallCheck(this, Balloon);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Balloon).call(this));

        _this.directory = directory;
        _this.descript = {};
        _this.attachedBlimp = [];
        _this.balloons = {
            sakura: [],
            kero: [],
            communicate: [],
            online: [],
            arrow: [],
            sstp: null,
            thumbnail: null
        };
        return _this;
    }

    _createClass(Balloon, [{
        key: "load",
        value: function load() {
            var _this2 = this;

            return Promise.resolve(this).then(function () {
                return _this2.loadDescript();
            }) // 1st
            .then(function () {
                return _this2.loadBalloonSurfaces();
            }) // 2nd
            .then(function () {
                return _this2.loadBalloonDescripts();
            }); // 3rd
        }
    }, {
        key: "loadDescript",
        value: function loadDescript() {
            var dir = this.directory;
            var getName = function getName(dic, reg) {
                return Object.keys(dic).filter(function (name) {
                    return reg.test(name);
                })[0] || "";
            };
            var descript_name = getName(dir, /^descript\.txt$/i);
            if (descript_name === "") {
                console.info("descript.txt is not found");
                this.descript = {};
            } else {
                this.descript = ikagaka_shell_js_1.SurfaceUtil.parseDescript(ikagaka_shell_js_1.SurfaceUtil.convert(dir[descript_name]));
            }
            return Promise.resolve(this);
        }
    }, {
        key: "loadBalloonDescripts",
        value: function loadBalloonDescripts() {
            var _this3 = this;

            var directory = this.directory;
            var balloons = this.balloons;
            var descript = this.descript;
            return new Promise(function (resolve, reject) {
                var keys = Object.keys(directory);
                var hits = keys.filter(function (filepath) {
                    return (/balloon([sk])(\d+)s\.txt$/.test(filepath)
                    );
                });
                hits.forEach(function (filepath) {
                    var buffer = directory[filepath];
                    var _descript = ikagaka_shell_js_1.SurfaceUtil.parseDescript(ikagaka_shell_js_1.SurfaceUtil.convert(buffer));

                    var _$exec = /balloon([sk])(\d+)s\.txt$/.exec(filepath);

                    var _$exec2 = _slicedToArray(_$exec, 3);

                    var __ = _$exec2[0];
                    var type = _$exec2[1];
                    var n = _$exec2[2];

                    console.log(balloons, n);
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
                resolve(_this3);
            });
        }
    }, {
        key: "loadBalloonSurfaces",
        value: function loadBalloonSurfaces() {
            var _this4 = this;

            var directory = this.directory;
            var balloons = this.balloons;
            var keys = Object.keys(directory);
            var hits = keys.filter(function (filepath) {
                return (/[^\/]+\.png$/.test(filepath)
                );
            });
            var promises = hits.map(function (filepath) {
                var buffer = directory[filepath];
                return ikagaka_shell_js_1.SurfaceUtil.fetchImageFromArrayBuffer(buffer).then(function (png) {
                    var cnv = ikagaka_shell_js_1.SurfaceUtil.pna({ cnv: null, png: png, pna: null }).cnv;
                    if (/^balloon([ksc])(\d+)\.png$/.test(filepath)) {
                        var _$exec3 = /^balloon([ksc])(\d+)\.png$/.exec(filepath);

                        var _$exec4 = _slicedToArray(_$exec3, 3);

                        var __ = _$exec4[0];
                        var type = _$exec4[1];
                        var n = _$exec4[2];

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
                    } else if (/^online(\d+)\.png$/.test(filepath)) {
                        var _$exec5 = /^online(\d+)\.png$/.exec(filepath);

                        var _$exec6 = _slicedToArray(_$exec5, 2);

                        var _ = _$exec6[0];
                        var _n = _$exec6[1];

                        balloons.online[Number(_n)] = { canvas: cnv, descript: {} };
                    } else if (/^arrow(\d+)\.png$/.test(filepath)) {
                        var _$exec7 = /^arrow(\d+)\.png$/.exec(filepath);

                        var _$exec8 = _slicedToArray(_$exec7, 2);

                        var _2 = _$exec8[0];
                        var _n2 = _$exec8[1];

                        balloons.arrow[Number(_n2)] = { canvas: cnv, descript: {} };
                    } else if (/^sstp\.png$/.test(filepath)) {
                        balloons.sstp = { canvas: cnv, descript: {} };
                    } else if (/^thumbnail\.png$/.test(filepath)) {
                        balloons.thumbnail = { canvas: cnv, descript: {} };
                    }
                });
            });
            return new Promise(function (resolve, reject) {
                Promise.all(promises).then(function () {
                    return resolve(_this4);
                });
            });
        }
    }, {
        key: "unload",
        value: function unload() {
            var _this5 = this;

            this.attachedBlimp.forEach(function (_ref) {
                var div = _ref.div;
                var surface = _ref.surface;
                return surface.destructor();
            });
            this.removeAllListeners();
            Object.keys(this).forEach(function (key) {
                return _this5[key] = null;
            });
            return;
        }
    }, {
        key: "attachBlimp",
        value: function attachBlimp(element, scopeId, balloonId) {
            var type = scopeId === 0 ? "sakura" : "kero";
            if (!(this.balloons[type] != null && this.balloons[type][balloonId] != null)) {
                console.warn("balloon id:", balloonId, "is not defined");
                return null;
            }
            var blimp = new BalloonSurface_1.default(element, scopeId, balloonId, this);
            this.attachedBlimp.push({ surface: blimp, div: element });
            return blimp;
        }
    }, {
        key: "detachBlimp",
        value: function detachBlimp(element) {
            var hits = this.attachedBlimp.filter(function (a) {
                return a.div === element;
            });
            if (hits.length === 0) {
                return;
            }
            hits[0].surface.destructor();
            this.attachedBlimp.splice(this.attachedBlimp.indexOf(hits[0]), 1);
            return;
        }
    }]);

    return Balloon;
}(events_1.EventEmitter);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Balloon;