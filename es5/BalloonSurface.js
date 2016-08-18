"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ikagaka_shell_js_1 = require("ikagaka.shell.js");
var $ = require("jquery");

var BalloonSurface = function () {
    function BalloonSurface(element, scopeId, balloonId, balloon) {
        _classCallCheck(this, BalloonSurface);

        this.element = element;
        this.scopeId = scopeId;
        this.balloonId = balloonId;
        this.balloon = balloon;
        this.type = this.scopeId === 0 ? "sakura" : "kero";
        this.isBalloonLeft = true;
        balloonId = this.balloonId;
        if (!this.isBalloonLeft) {
            // バルーンが右向きならバルーンIDは+1
            balloonId++;
        }
        // バルーンごとに固有のdescript
        var a, b, c;
        if ((a = this.balloon.balloons[this.type]) != null && (b = a[balloonId]) != null && (c = b.descript) != null) {
            this.descript = c;
        } else {
            this.descript = {};
        }
        this.destructed = false;
        this.destructors = [];
        this.insertPoint = null;
        this.width = 0;
        this.height = 0;
        this.destructors = [];
        this.$blimp = null;
        this.$blimpCanvas = null;
        this.$blimpText = null;
        this.initDOMStructure();
        this.initEventListener();
        this.initStyleFromDescript();
        this.render();
    }

    _createClass(BalloonSurface, [{
        key: "initDOMStructure",
        value: function initDOMStructure() {
            this.$blimp = $(this.element).addClass("blimp");
            this.$blimpCanvas = $("<canvas width='0' height='0' />").addClass("blimpCanvas");
            this.$blimpText = $("<div />").addClass("blimpText");
            this.$blimp.append(this.$blimpCanvas);
            this.$blimp.append(this.$blimpText);
            this.$blimp.css({
                position: "absolute",
                top: "0px",
                left: "0px",
                "pointer-events": "auto"
            });
            this.$blimpCanvas.css({
                position: "absolute",
                top: "0px",
                left: "0px"
            });
            this.$blimpText.css({
                position: "absolute",
                top: "0px",
                left: "0px",
                "overflow-y": "scroll",
                "white-space": "pre-wrap",
                "word-wrap": "break-all"
            });
            $("<style scoepd />").text("\n    .blimpText a {\n      cursor: pointer;\n    }\n    @keyframes blink {\n      75% { opacity: 0.0; }\n    }\n    .blimpText .blink {\n      animation: blink 1s step-end infinite;\n    }\n    ").appendTo(this.$blimp);
            this.insertPoint = this.$blimpText;
            return;
        }
    }, {
        key: "initEventListener",
        value: function initEventListener() {
            var _this = this;

            var mouselistener = function mouselistener(ev) {
                var custom = {
                    type: ev.type,
                    scopeId: _this.scopeId,
                    balloonId: _this.balloonId,
                    event: ev
                };
                _this.balloon.emit("mouse", custom);
            };
            this.$blimp.on("click", mouselistener);
            this.$blimp.on("dblclick", mouselistener);
            this.$blimp.on("mousemove", mouselistener);
            this.$blimp.on("mousedown", mouselistener);
            this.$blimp.on("mouseup", mouselistener);
            var onchoiceclick = function onchoiceclick(ev) {
                var dataset = ev.target["dataset"];
                var event = {
                    type: "choiceselect",
                    id: dataset["id"],
                    args: [],
                    text: ev.target.textContent
                };
                var argc = Number(dataset["argc"]);
                for (var i = 0; i <= argc; i++) {
                    event.args.push(dataset["argv" + i]);
                }
                _this.balloon.emit("select", event);
            };
            this.$blimp.on("click", ".ikagaka-choice", onchoiceclick);
            var onanchorclick = function onanchorclick(ev) {
                var dataset = ev.target["dataset"];
                var event = {
                    type: "anchorselect",
                    id: dataset["id"],
                    args: [],
                    text: ev.target.textContent
                };
                var argc = Number(dataset["argc"]);
                for (var i = 0; i <= argc; i++) {
                    event.args.push(dataset["argv" + i]);
                }
                _this.balloon.emit("select", event);
            };
            this.$blimp.on("click", ".ikagaka-anchor", onanchorclick);
            this.destructors.push(function () {
                _this.$blimp.off("click", mouselistener);
                _this.$blimp.off("dblclick", mouselistener);
                _this.$blimp.off("click", ".ikagaka-choice", onchoiceclick);
                _this.$blimp.off("click", ".ikagaka-anchor", onanchorclick);
            });
            return;
        }
    }, {
        key: "initStyleFromDescript",
        value: function initStyleFromDescript() {
            var _this2 = this;

            var descript = this.balloon.descript;
            this._text_style = {
                "cursor": descript["cursor"] || '',
                "font.name": (descript["font.name"] || "MS Gothic").split(/,/).map(function (name) {
                    return '"' + name + '"';
                }).join(','),
                "font.height": (descript["font.height"] || "12") + "px",
                "font.color": this._getFontColor(descript["font.color.r"], descript["font.color.g"], descript["font.color.b"]),
                "font.shadowcolor": this._getFontColor(descript["font.shadowcolor.r"], descript["font.shadowcolor.g"], descript["font.shadowcolor.b"], true),
                "font.bold": descript["font.bold"],
                "font.italic": descript["font.italic"],
                "font.strike": descript["font.strike"],
                "font.underline": descript["font.underline"]
            };
            var clickable_element_style = function clickable_element_style(prefix, style_default, descript) {
                var can_ignore = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

                return {
                    "style": { square: true, underline: true, 'square+underline': true, none: true }[descript[prefix + ".style"]] ? descript[prefix + ".style"] : style_default,
                    "font.color": _this2._getFontColor(descript[prefix + ".font.color."], descript[prefix + ".font.color.g"], descript[prefix + ".font.color.b"], can_ignore),
                    "pen.color": _this2._getFontColor(descript[prefix + ".pen.color.r"], descript[prefix + ".pen.color.g"], descript[prefix + ".pen.color.b"], can_ignore),
                    "brush.color": _this2._getFontColor(descript[prefix + ".brush.color.r"], descript[prefix + ".brush.color.g"], descript[prefix + ".brush.color.b"], can_ignore)
                };
            };
            this._choice_style = clickable_element_style("cursor", "square", descript);
            this._choice_notselect_style = clickable_element_style("cursor.notselect", undefined, descript, true);
            this._anchor_style = clickable_element_style("anchor", "underline", descript);
            this._anchor_notselect_style = clickable_element_style("anchor.notselect", undefined, descript, true);
            this.$blimpText.css(this._blimpTextCSS(this._text_style));
            this._initializeCurrentStyle();
            return;
        }
    }, {
        key: "_blimpTextCSS",
        value: function _blimpTextCSS(styles) {
            var css = {};
            css["cursor"] = styles["cursor"];
            css["font-family"] = styles["font.name"];
            css["font-size"] = styles["font.height"];
            css["color"] = styles["font.color"];
            css["background"] = "none";
            css["outline"] = "none";
            css["border"] = "none";
            css["text-shadow"] = styles["font.shadowcolor"] ? "1px 1px 0 " + styles["font.shadowcolor"] : "none";
            css["font-weight"] = styles["font.bold"] ? "bold" : "normal";
            css["font-style"] = styles["font.italic"] ? "italic" : "normal";
            var text_decoration = [];
            if (styles["font.strike"]) {
                text_decoration.push('line-through');
            }
            if (styles["font.underline"]) {
                text_decoration.push('underline');
            }
            css["text-decoration"] = text_decoration.length ? text_decoration.join(' ') : "none";
            css["line-height"] = "1.2em";
            return css;
        }
    }, {
        key: "_blimpClickableTextCSS",
        value: function _blimpClickableTextCSS(styles) {
            var default_styles = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var color = styles["font.color"] || default_styles["font.color"];
            var outline = styles["pen.color"] ? "solid 1px " + styles["pen.color"] : default_styles["pen.color"] ? "solid 1px " + default_styles["pen.color"] : "solid 1px " + default_styles["font.color"];
            var background = styles["brush.color"] || default_styles["brush.color"] || default_styles["font.color"];
            var border_bottom = styles["pen.color"] ? "solid 1px " + styles["pen.color"] : default_styles["pen.color"] ? "solid 1px " + default_styles["pen.color"] : "solid 1px " + default_styles["font.color"];
            switch (styles["style"]) {
                case "square":
                    return {
                        base: { color: color },
                        over: {
                            outline: outline,
                            background: background,
                            "border-bottom": "none" } };
                case "underline":
                    return {
                        base: { color: color },
                        over: {
                            outline: "none",
                            background: "none",
                            'border-bottom': border_bottom } };
                case "square+underline":
                    return {
                        base: { color: color },
                        over: {
                            outline: outline,
                            background: background,
                            'border-bottom': border_bottom } };
                case "none":
                    return {
                        base: { color: color },
                        over: {
                            outline: "none",
                            background: "none",
                            "border-bottom": "none" } };
                default:
                    return {
                        base: {},
                        over: {} };
            }
        }
    }, {
        key: "_initializeCurrentStyle",
        value: function _initializeCurrentStyle() {
            this._current_text_style = {};
            for (var name in this._text_style) {
                var value = this._text_style[name];
                this._current_text_style[name] = value;
            }
            this._current_choice_style = {};
            for (var _name in this._choice_style) {
                var _value = this._choice_style[_name];
                this._current_choice_style[_name] = _value;
            }
            this._current_choice_notselect_style = {};
            for (var _name2 in this._choice_notselect_style) {
                var _value2 = this._choice_notselect_style[_name2];
                this._current_choice_notselect_style[_name2] = _value2;
            }
            this._current_anchor_style = {};
            for (var _name3 in this._anchor_style) {
                var _value3 = this._anchor_style[_name3];
                this._current_anchor_style[_name3] = _value3;
            }
            this._current_anchor_notselect_style = {};
            for (var _name4 in this._anchor_notselect_style) {
                var _value4 = this._anchor_notselect_style[_name4];
                this._current_anchor_notselect_style[_name4] = _value4;
            }
            return;
        }
    }, {
        key: "_getFontColor",
        value: function _getFontColor(r, g, b) {
            var can_ignore = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

            var rc = Number(r != null ? r.replace(/%$/, '') : Number.NaN);
            var gc = Number(g != null ? g.replace(/%$/, '') : Number.NaN);
            var bc = Number(b != null ? b.replace(/%$/, '') : Number.NaN);
            if ((isNaN(rc) || rc < 0) && (isNaN(gc) || gc < 0) && (isNaN(bc) || bc < 0)) {
                if (can_ignore) {
                    return "";
                } else {
                    return "rgb(0,0,0)";
                }
            } else {
                return "rgb(" + r + "," + g + "," + b + ")";
            }
        }
    }, {
        key: "location",
        value: function location(x, y) {
            var re = /^(@)?(-?\d*\.?\d*e?\d*)(em|%)?$/;
            var toparam = function toparam(r) {
                r = r + "";
                if (!r.length) {
                    return { relative: true, value: "0em" };
                }
                var rp = r.match(re);
                if (rp == null) {
                    return void 0;
                } // avoid "Not all code paths return a value"
                if (isNaN(Number(rp[2]))) {
                    return void 0;
                } // avoid "Not all code paths return a value"
                if (rp[3] == '%') {
                    var value = Number(rp[2]) / 100;
                    var unit = 'em';
                } else {
                    var value = Number(rp[2]);
                    var unit = rp[3] || 'px';
                }
                return {
                    relative: !!rp[1],
                    value: value + unit
                };
            };
            var xp = toparam(x);
            var yp = toparam(y);
            if (!(xp != null && yp != null)) {
                return;
            }
            if (xp.relative || yp.relative) {
                var $imp_position_checker = $('<span>.</span>');
                this.insertPoint.append($imp_position_checker);
                var offset = $imp_position_checker.offset();
                var baseoffset = this.$blimpText.offset();
                var offsetx = offset.left - baseoffset.left;
                var offsety = offset.top - baseoffset.top + this.$blimpText.scrollTop();
                $imp_position_checker.remove();
            }
            if (!xp.relative) {
                var offsetx = 0;
            }
            if (!yp.relative) {
                var offsety = 0;
            }
            var $newimp_container_top = $('<div />').addClass("newimp_container_top").css({ 'position': 'absolute', 'pointer-events': 'none', 'top': yp.value });
            var $newimp_container = $('<div />').addClass("newimp_container").css({ 'position': 'absolute', 'pointer-events': 'none', 'text-indent': offsetx + 'px', 'top': offsety + 'px', 'width': this.$blimpText[0].clientWidth });
            var $newimp = $('<span />').css({ 'pointer-events': 'auto', 'margin-left': xp.value });
            this.insertPoint = $newimp.appendTo($newimp_container.appendTo($newimp_container_top.appendTo(this.$blimpText)));
            this.insertPoint.css(this._blimpTextCSS(this._current_text_style));
            return;
        }
    }, {
        key: "destructor",
        value: function destructor() {
            var _this3 = this;

            this.destructor = function () {
                return console.warn("this blimp was already destructed", _this3);
            };
            this.destructors.forEach(function (fn) {
                return fn();
            });
            this.destructed = true;
            this.$blimp.removeClass("blimp");
            this.$blimp.children().remove();
            this.balloon = null;
            return;
        }
    }, {
        key: "render",
        value: function render() {
            // canvasに指定の背景画像を描画
            var balloonId = this.balloonId;
            if (!this.isBalloonLeft) {
                balloonId++;
            }
            ;
            var baseCanvas = this.balloon.balloons[this.type][balloonId].canvas;
            this.descript = this.balloon.balloons[this.type][balloonId].descript || {};
            var cnv = this.$blimpCanvas[0];
            ikagaka_shell_js_1.SurfaceUtil.init(cnv, cnv.getContext("2d"), baseCanvas);
            // 大きさ調整
            this.$blimp.width(this.width = cnv.width);
            this.$blimp.height(this.height = cnv.height);
            // テキスト領域を計算
            var descript = this.descript;
            var t = descript["origin.y"] || descript["validrect.top"] || "10";
            var r = descript["validrect.right"] || "10";
            var b = descript["validrect.bottom"] || "10";
            var l = descript["origin.x"] || descript["validrect.left"] || "10";
            var w = cnv.width;
            var h = cnv.height;
            this.$blimpText.css({
                top: t + "px",
                left: l + "px",
                width: w - (Number(l) + Number(r)) + "px",
                height: h - (Number(t) - Number(b)) + "px"
            });
            return;
        }
    }, {
        key: "left",
        value: function left() {
            this.isBalloonLeft = true;
            this.render();
        }
    }, {
        key: "right",
        value: function right() {
            this.isBalloonLeft = false;
            this.render();
        }
    }, {
        key: "surface",
        value: function surface(balloonId) {
            // * http://ssp.shillest.net/ukadoc/manual/manual_balloon.html
            // > 偶数番のIDは左向きのバルーン、奇数番のIDは右向きのバルーンとして、二つセットになる
            balloonId - balloonId % 2;
            if (!this.isBalloonLeft) {
                balloonId++;
            }
            this.balloonId = balloonId;
            this.render();
        }
    }, {
        key: "anchorBegin",
        value: function anchorBegin(id) {
            this.$blimpText.find(".blink").hide();
            this.$blimp.show();
            var _id = $(document.createElement("div")).text(id).html();
            var $a = $("<a />").addClass("ikagaka-anchor");
            var text_css = this._blimpTextCSS(this._current_text_style);
            var anchor_css = this._blimpClickableTextCSS(this._current_anchor_style);
            var anchor_notselect_css = this._blimpClickableTextCSS(this._current_anchor_notselect_style, this._current_anchor_style);
            $a.css(text_css).css(anchor_css.base).css(anchor_notselect_css.base).css(anchor_notselect_css.over);
            $a.mouseover(function () {
                return $a.css(anchor_css.over);
            });
            $a.mouseout(function () {
                return $a.css(text_css).css(anchor_css.base).css(anchor_notselect_css.base).css(anchor_notselect_css.over);
            });
            $a.attr("data-id", _id);

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            $a.attr("data-argc", args.length);
            for (var argv in args) {
                var index = args[argv];
                $a.attr("data-argv" + index, argv);
            }
            this.originalInsertPoint = this.insertPoint;
            this.insertPoint = $a.appendTo(this.insertPoint);
            return;
        }
    }, {
        key: "anchorEnd",
        value: function anchorEnd() {
            this.insertPoint = this.originalInsertPoint;
            return;
        }
    }, {
        key: "choice",
        value: function choice(text, id) {
            this.$blimpText.find(".blink").hide();
            this.$blimp.show();
            var _text = $(document.createElement("div")).text(text).html();
            var _id = $(document.createElement("div")).text(id).html();
            var $a = $("<a />").addClass("ikagaka-choice");
            var text_css = this._blimpTextCSS(this._current_text_style);
            var choice_css = this._blimpClickableTextCSS(this._current_choice_style);
            var choice_notselect_css = this._blimpClickableTextCSS(this._current_choice_notselect_style, this._current_text_style);
            $a.css(text_css).css(choice_notselect_css.base).css(choice_notselect_css.over);
            $a.mouseover(function () {
                return $a.css(choice_css.base).css(choice_css.over);
            });
            $a.mouseout(function () {
                return $a.css(text_css).css(choice_notselect_css.base).css(choice_notselect_css.over);
            });
            $a.html(_text);
            $a.attr("data-id", _id);

            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
            }

            $a.attr("data-argc", args.length);
            for (var argv in args) {
                var index = args[argv];
                $a.attr("data-argv" + index, argv);
            }
            $a.appendTo(this.insertPoint);
            return;
        }
    }, {
        key: "choiceBegin",
        value: function choiceBegin(id) {
            this.$blimpText.find(".blink").hide();
            this.$blimp.show();
            var _id = $(document.createElement("div")).text(id).html();
            var $a = $("<a />").addClass("ikagaka-choice");
            var text_css = this._blimpTextCSS(this._current_text_style);
            var choice_css = this._blimpClickableTextCSS(this._current_choice_style);
            var choice_notselect_css = this._blimpClickableTextCSS(this._current_choice_notselect_style, this._current_text_style);
            $a.css(text_css).css(choice_notselect_css.base).css(choice_notselect_css.over);
            $a.mouseover(function () {
                return $a.css(choice_css.base).css(choice_css.over);
            });
            $a.mouseout(function () {
                return $a.css(text_css).css(choice_notselect_css.base).css(choice_notselect_css.over);
            });
            $a.attr("data-id", _id);

            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            $a.attr("data-argc", args.length);
            for (var argv in args) {
                var index = args[argv];
                $a.attr("data-argv" + index, argv);
            }
            this.originalInsertPoint = this.insertPoint;
            this.insertPoint = $a.appendTo(this.insertPoint);
            return;
        }
    }, {
        key: "choiceEnd",
        value: function choiceEnd() {
            this.insertPoint = this.originalInsertPoint;
            return;
        }
    }, {
        key: "talk",
        value: function talk(text) {
            this.$blimpText.find(".blink").hide();
            var _text = $(document.createElement("div")).text(text).html();
            if (!!this.currentSurface) {
                this.currentSurface.talk();
            }
            this.$blimp.show();
            this.insertPoint.append(_text);
            this.$blimpText[0].scrollTop = 999;
            return;
        }
    }, {
        key: "talkraw",
        value: function talkraw(text) {
            this.$blimpText.find(".blink").hide();
            if (!!this.currentSurface) {
                this.currentSurface.talk();
            }
            this.$blimp.show();
            this.insertPoint.append(text);
            this.$blimpText[0].scrollTop = 999;
            return;
        }
    }, {
        key: "marker",
        value: function marker() {
            this.$blimpText.find(".blink").hide();
            var _text = $(document.createElement("div")).text("・").html();
            this.$blimp.show();
            this.insertPoint.append(_text);
            this.$blimpText[0].scrollTop = 999;
            return;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.$blimpText.html("");
            this.insertPoint = this.$blimpText;
            this._initializeCurrentStyle();
            return;
        }
    }, {
        key: "br",
        value: function br(ratio) {
            if (ratio != null) {
                this.location('0', '@' + ratio + 'em');
            } else {
                this.insertPoint.append("<br />");
            }
        }
    }, {
        key: "showWait",
        value: function showWait() {
            this.insertPoint.append("<br /><br />").append("<div class='blink'>▼</div>");
            this.$blimpText[0].scrollTop = 999;
            return;
        }
    }, {
        key: "font",
        value: function font(name) {
            var _this4 = this;

            for (var _len4 = arguments.length, values = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                values[_key4 - 1] = arguments[_key4];
            }

            var value = values[0];
            var treat_bool = function treat_bool(name, value) {
                if (value === 'default') {
                    _this4._current_text_style["font." + name] = _this4._text_style["font." + name];
                } else {
                    _this4._current_text_style["font." + name] = "" + !(value === 'false' || value - 0 === 0);
                }
            };
            var treat_clickable_styles = function treat_clickable_styles(treat_name, name, value, values, _current_style, _style) {
                switch (name) {
                    case treat_name + "style":
                        if (value === 'default') {
                            _current_style["style"] = _style["style"];
                        } else {
                            _current_style["style"] = value;
                        }
                        break;
                    case treat_name + "fontcolor":
                        if (value === 'default') {
                            _current_style["font.color"] = _style["font.color"];
                        } else if (values[0] != null && values[1] != null && values[2] != null) {
                            _current_style["font.color"] = _this4._getFontColor(values[0], values[1], values[2]);
                        } else {
                            _current_style["font.color"] = value;
                        }
                        break;
                    case treat_name + "pencolor":
                        if (value === 'default') {
                            _current_style["pen.color"] = _style["pen.color"];
                        } else if (values[0] != null && values[1] != null && values[2] != null) {
                            _current_style["pen.color"] = _this4._getFontColor /*_getpenColor が存在しない！！！ので代用*/(values[0], values[1], values[2]);
                        } else {
                            _current_style["pen.color"] = value;
                        }
                        break;
                    case (treat_name + "color", treat_name + "brushcolor"):
                        if (value === 'default') {
                            _current_style["brush.color"] = _style["brush.color"];
                        } else if (values[0] != null && values[1] != null && values[2] != null) {
                            _current_style["brush.color"] = _this4._getFontColor(values[0], values[1], values[2]);
                        } else {
                            _current_style["brush.color"] = value;
                        }
                        break;
                }
            };
            switch (name) {
                case 'name':
                    var is_text_style = true;
                    this._current_text_style["font.name"] = values.map(function (name) {
                        return '"' + name + '"';
                    }).join(',');
                    break;
                case 'height':
                    var is_text_style = true;
                    if (value === 'default') {
                        this._current_text_style["font.height"] = this._text_style["font.height"];
                    } else if (/^[+-]/.test(value)) {
                        var $size_checker = $('<span />').text('I').css({ position: 'absolute', visibility: 'hidden', 'width': '1em', 'font-size': '1em', padding: 0, 'line-height': '1em' });
                        this.insertPoint.append($size_checker);
                        var size = $size_checker[0].clientHeight;
                        $size_checker.remove();
                        this._current_text_style["font.height"] = Number(size) + Number(value) + 'px';
                    } else if (!isNaN(Number(value))) {
                        this._current_text_style["font.height"] = value + 'px';
                    } else {
                        this._current_text_style["font.height"] = value;
                    }
                    break;
                case 'color':
                    var is_text_style = true;
                    if (value === 'default') {
                        this._current_text_style["font.color"] = this._text_style["font.color"];
                    } else if (values[0] != null && values[1] != null && values[2] != null) {
                        this._current_text_style["font.color"] = this._getFontColor(values[0], values[1], values[2]);
                    } else {
                        this._current_text_style["font.color"] = value;
                    }
                    break;
                case 'shadowcolor':
                    var is_text_style = true;
                    if (value === 'default') {
                        this._current_text_style["font.shadowcolor"] = this._text_style["font.shadowcolor"];
                    } else if (value === 'none') {
                        this._current_text_style["font.shadowcolor"] = undefined;
                    } else if (values[0] != null && values[1] != null && values[2] != null) {
                        this._current_text_style["font.shadowcolor"] = this._getFontColor(values[0], values[1], values[2]);
                    } else {
                        this._current_text_style["font.shadowcolor"] = value;
                    }
                    break;
                case 'bold':
                    var is_text_style = true;
                    treat_bool('bold', value);
                    break;
                case 'italic':
                    var is_text_style = true;
                    treat_bool('italic', value);
                    break;
                case 'strike':
                    var is_text_style = true;
                    treat_bool('strike', value);
                    break;
                case 'underline':
                    var is_text_style = true;
                    treat_bool('underline', value);
                    break;
                case 'default':
                    var is_text_style = true;
                    this._initializeCurrentStyle();
                    break;
                case ('cursorstyle', 'cursorfontcolor', 'cursorpencolor', 'cursorcolor', 'cursorbrushcolor'):
                    treat_clickable_styles('cursor', name, value, values, this._current_choice_style, this._choice_style);
                    break;
                case ('anchorstyle', 'anchorfontcolor', 'anchorpencolor', 'anchorcolor', 'anchorbrushcolor'):
                    treat_clickable_styles('anchor', name, value, values, this._current_anchor_style, this._anchor_style);
                    break;
                case ('cursornotselectstyle', 'cursornotselectfontcolor', 'cursornotselectpencolor', 'cursornotselectcolor', 'cursornotselectbrushcolor'):
                    treat_clickable_styles('cursornotselect', name, value, values, this._current_choice_notselect_style, this._choice_notselect_style);
                    break;
                case ('anchornotselectstyle', 'anchornotselectfontcolor', 'anchornotselectpencolor', 'anchornotselectcolor', 'anchornotselectbrushcolor'):
                    treat_clickable_styles('anchornotselect', name, value, values, this._current_anchor_notselect_style, this._anchor_notselect_style);
                    break;
            }
            if (is_text_style) {
                var $newimp = $('<span />');
                this.insertPoint = $newimp.appendTo(this.insertPoint);
                this.insertPoint.css(this._blimpTextCSS(this._current_text_style));
            }
            return;
        }
    }]);

    return BalloonSurface;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BalloonSurface;