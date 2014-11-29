SurfaceUtil = @Shell?.SurfaceUtil || @Ikagaka?["Shell"]?.SurfaceUtil || require("ikagaka.shell.js").SurfaceUtil

class BalloonSurface

  constructor: (@element, @scopeId, balloonConf, @balloons)->
    @descript = balloonConf.descript
    @baseCanvas = balloonConf.canvas
    @render()

  destructor: ->
    return

  render: ->
    type = if @scopeId is 0 then "sakura" else "kero"
    util = new SurfaceUtil(@element)
    util.init(@baseCanvas)
    return

if module?.exports?
  module.exports = BalloonSurface
else if @Ikagaka?
  @Ikagaka.BalloonSurface = BalloonSurface
else
  @BalloonSurface = BalloonSurface
