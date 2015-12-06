{SurfaceUtil} = require("ikagaka.shell.js")
Blimp = require("./Blimp")
EventEmitter = require("eventemitter3")

class Balloon extends EventEmitter

  constructor: (@directory)->
    super();

    @descript = {}
    @attachedBlimp = []
    @balloons =
      "sakura": []
      "kero": []
      "communicate": []
      "online": []
      "arrow": []
      "sstp": null
      "thumbnail": null

  load: ->
    return Promise.resolve(this)
    .then(()=> @loadDescript()) # 1st
    .then(()=> @loadBalloonSurfaces()) # 2nd
    .then(()=> @loadBalloonDescripts()) # 3rd

  loadDescript: ()->
    dir = this.directory
    getName = (dic, reg)=>
      Object.keys(dic).filter((name)=> reg.test(name))[0] || ""
    descript_name = getName(dir, /^descript\.txt$/i)
    if descript_name is ""
      console.info("descript.txt is not found")
      @descript = {}
    else
      @descript = SurfaceUtil.parseDescript(SurfaceUtil.convert(dir[descript_name]))
    return Promise.resolve(@)

  loadBalloonDescripts: ()->
    directory = @directory
    balloons = @balloons
    descript = @descript
    return new Promise (resolve, reject)=>
      keys = Object.keys(directory)
      hits = keys.filter (filepath)-> /balloon([sk])(\d+)s\.txt$/.test(filepath)
      hits.forEach (filepath)->
        buffer = directory[filepath]
        _descript = SurfaceUtil.parseDescript(SurfaceUtil.convert(buffer))
        [__, type, n] = /balloon([sk])(\d+)s\.txt$/.exec(filepath)
        SurfaceUtil.extend(_descript, descript)
        switch type
          when "s" then balloons["sakura"][Number(n)].descript = _descript
          when "k" then balloons["kero"  ][Number(n)].descript = _descript
      resolve(@)

  loadBalloonSurfaces: ()->
    directory = @directory
    balloons = @balloons
    keys = Object.keys(directory)
    hits = keys.filter((filepath)-> /[^\/]+\.png$/.test(filepath))
    promises = hits.map (filepath)->
      buffer = directory[filepath]
      SurfaceUtil.createSurfaceCanvasFromArrayBuffer(buffer)
      .then ({img, cnv})->
        if /^balloon([ksc])(\d+)\.png$/.test(filepath)
          [__, type, n] = /^balloon([ksc])(\d+)\.png$/.exec(filepath)
          switch type
            when "s" then balloons["sakura"     ][Number(n)] = {canvas: cnv}
            when "k" then balloons["kero"       ][Number(n)] = {canvas: cnv}
            when "c" then balloons["communicate"][Number(n)] = {canvas: cnv}
        else if /^online(\d+)\.png$/.test(filepath)
          [__, n] = /^online(\d+)\.png$/.exec(filepath)
          balloons["online"][Number(n)] = {canvas: cnv}
        else if /^arrow(\d+)\.png$/.test(filepath)
          [__, n] = /^arrow(\d+)\.png$/.exec(filepath)
          balloons["arrow"][Number(n)] = {canvas: cnv}
        else if /^sstp\.png$/.test(filepath)
          balloons["sstp"] = {canvas: cnv}
        else if /^thumbnail\.png$/.test(filepath)
          balloons["thumbnail"] = {canvas: cnv}
    return new Promise (resolve, reject)=>
      Promise.all(promises).then => resolve(@)

  unload: ->
    @attachedBlimp.forEach ({element, blimp})-> blimp.destructor()
    @removeAllListeners()
    Object.keys(this).forEach (key)=> @[key] = null
    return

  attachBlimp: (element, scopeId, balloonId)->
    type = if scopeId is 0 then "sakura" else "kero"
    if !@balloons[type][balloonId]?
      console.warn("balloon id:", balloonId, "is not defined")
      return null
    blimp = new Blimp(element, scopeId, balloonId, this)
    @attachedBlimp.push({blimp, element})
    return blimp

  detachBlimp: (element)->
    hits = @attachedBlimp.filter(({element: _element})=> _element is element)
    return if hits.length is 0
    hits[0].blimp.destructor()
    @attachedBlimp.splice(@attachedBlimp.indexOf(hits[0]), 1)
    return


module.exports = Balloon
