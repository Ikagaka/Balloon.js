

class BalloonSurface

  SurfaceUtil = window["SurfaceUtil"]

  constructor: (@element, @scopeId, @surfaceId, @balloons)->
    $(@element).on "click", (ev)=>
      $(@element).trigger(
        $.Event('IkagakaBalloonEvent', {
          detail:{
            ID: "OnBallonClick"
          },
          bubbles: true
        }))
    @render()

  destructor: ->
    $(@element).off() # g.c.
    undefined

  render: ->
    type = if @scopeId is 0 then "sakura" else "kero"
    util = new SurfaceUtil(@element)
    util.init(@balloons[type][@surfaceId].canvas)
    undefined
