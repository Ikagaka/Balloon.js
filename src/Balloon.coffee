{SurfaceRender, SurfaceUtil} = require("ikagaka.shell.js")
{Blimp} = require("./Blimp")

class Balloon extends EventEmitter2

  constructor: (@directory)->
    super();

    @descript = {}
    @attachedSurface = []
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
    Balloon.prototype.loadDescript = ()-> console.warn("loadDescript method allows only 1st call")
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
    Balloon.prototype.loadBalloonDescripts = ()-> console.warn("loadBalloonDescripts method allows only 1st call")
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
        switch type
          when "s" then balloons["sakura"][Number(n)].descript=  $.extend(true, _descript, descript)
          when "k" then balloons["kero"  ][Number(n)].descript = $.extend(true, _descript, descript)
      resolve(@)

  loadBalloonSurfaces: ()->
    Balloon.prototype.loadBalloonSurfaces = ()-> console.warn("loadBalloonSurfaces method allows only 1st call")
    directory = @directory
    balloons = @balloons
    keys = Object.keys(directory)
    hits = keys.filter((filepath)-> /[^\/]+\.png$/.test(filepath))
    promises = hits.map (filepath)->
      new Promise (resolve, reject)->
        buffer = directory[filepath]
        url = URL.createObjectURL(new Blob([buffer], {type: "image/png"}))
        SurfaceUtil.fetchImageFromURL(url)
        .then((img)->[null, img])
        .catch((err)-> [err, null])
        .then ([err, img])->
          if !!err then return reject(err)
          URL.revokeObjectURL(url)
          if !!err then return reject(err)
          rndr = new SurfaceRender(SurfaceUtil.copy(img))
          rndr.chromakey()
          if /^balloon([ksc])(\d+)\.png$/.test(filepath)
            [__, type, n] = /^balloon([ksc])(\d+)\.png$/.exec(filepath)
            switch type
              when "s" then balloons["sakura"     ][Number(n)] = {canvas: rndr.cnv}
              when "k" then balloons["kero"       ][Number(n)] = {canvas: rndr.cnv}
              when "c" then balloons["communicate"][Number(n)] = {canvas: rndr.cnv}
          else if /^online(\d+)\.png$/.test(filepath)
            [__, n] = /^online(\d+)\.png$/.exec(filepath)
            balloons["online"][Number(n)] = {canvas: rndr.cnv}
          else if /^arrow(\d+)\.png$/.test(filepath)
            [__, n] = /^arrow(\d+)\.png$/.exec(filepath)
            balloons["arrow"][Number(n)] = {canvas: rndr.cnv}
          else if /^sstp\.png$/.test(filepath)
            balloons["sstp"] = {canvas: rndr.cnv}
          else if /^thumbnail\.png$/.test(filepath)
            balloons["thumbnail"] = {canvas: rndr.cnv}
          resolve()
    return new Promise (resolve, reject)=>
      Promise.all(promises).then => resolve(@)

  unload: ->
    @attachedBlimp.forEach ({element, blimp})-> blimp.destructor()
    @removeAllListeners()
    Object.keys(this).forEach (key)=> @[key] = new @[key].constructor()
    return

  attachBlimp: (element, scopeId, balloonId)->
    type = SurfaceUtil.scope(scopeId)
    if !@balloons[type][balloonId]?
      console.warn("balloon id:", balloonId, "is not defined")
      return null
    blimp = new Blimp(element, scopeId, balloonId, this)
    @attachedSurface.push({blimp, element})
    return blimp

  detachBlimp: (element)->
    hits = @attachedBlimp.filter(({element: _element})=> _element is element)
    return if hits.length is 0
    hits[0].blimp.destructor()
    @attachedBlimp.splice(@attachedBlimp.indexOf(hits[0]), 1)
    return


exports.Balloon = Balloon
