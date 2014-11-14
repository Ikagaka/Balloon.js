

class BalloonSurface
  constructor: (@scopeId, @surfaceId, @balloons)->
    type = if @scopeId is 0 then "sakura" else "kero"
    @element = @balloons[type][@surfaceId].canvas
  destructor: ->
  playAnimation: ->
  stopAnimation: ->
