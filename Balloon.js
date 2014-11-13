// Generated by CoffeeScript 1.7.1
var Balloon;

Balloon = (function() {
  var Nar, Shell, SurfaceUtil;

  Nar = window["Nar"];

  Shell = window["Shell"];

  SurfaceUtil = window["SurfaceUtil"];

  function Balloon(tree) {
    if (!tree["descript.txt"]) {
      throw new Error("descript.txt not found");
    }
    this.tree = tree;
    this.descript = Nar.parseDescript(Nar.convert(this.tree["descript.txt"].asArrayBuffer()));
  }

  Balloon.prototype.load = function(callback) {};

  Balloon.prototype.getSurface = function(scopeId, surfaceId) {};

  return Balloon;

})();
