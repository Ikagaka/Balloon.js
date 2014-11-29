$ = window["Zepto"]

Nar            = window["Nar"]            || window["Ikagaka"]?["Nar"]            || require("ikagaka.nar.js")
SurfaceUtil    = @Shell?.SurfaceUtil      || @Ikagaka?["Shell"]?.SurfaceUtil      || require("ikagaka.shell.js").SurfaceUtil
BalloonSurface = window["BalloonSurface"] || window["Ikagaka"]?["BalloonSurface"] || require("./BalloonSurface.js")

URL = window["URL"]

class Balloon

  constructor: (directory)->
    if !directory["descript.txt"] then throw new Error("descript.txt not found")
    @directory = directory
    buffer = @directory["descript.txt"].asArrayBuffer()
    @descript = Nar.parseDescript(Nar.convert(buffer))
    @balloons =
      "sakura": []
      "kero": []
      "communicate": []
      "online": []
      "arrow": []
      "sstp": null
      "thumbnail": null

  load: (callback)->
    Balloon.loadBalloonSurfaces @directory, @balloons, (err)=>
      Balloon.loadBalloonDescripts(@directory, @balloons, @descript)
      delete @directory
      callback(err)
    return

  attachSurface: (canvas, scopeId, surfaceId)->
    type = if scopeId is 0 then "sakura" else "kero"
    if !@balloons[type][surfaceId]? then return null
    return new BalloonSurface(canvas, scopeId, @balloons[type][surfaceId], @balloons)

  @loadBalloonDescripts: (directory, balloons, descript)->
    keys = Object.keys(directory)
    hits = keys.filter (filepath)-> /balloon([sk])(\d+)s\.txt$/.test(filepath)
    hits.forEach (filepath)->
      buffer = directory[filepath].asArrayBuffer()
      _descript = Nar.parseDescript(Nar.convert(buffer))
      [__, type, n] = /balloon([sk])(\d+)s\.txt$/.exec(filepath)
      switch type
        when "s" then balloons["sakura"][Number(n)].descript = $.extend(true, _descript, descript)
        when "k" then balloons["kero"][Number(n)].descript = $.extend(true, _descript, descript)
    return balloons

  @loadBalloonSurfaces: (directory, balloons, callback)->
    keys = Object.keys(directory)
    hits = keys.filter((filepath)-> /[^\/]+\.png$/.test(filepath))
    promises = hits.map (filepath)->
      new Promise (resolve, reject)->
        setTimeout ->
          buffer = directory[filepath].asArrayBuffer()
          url = URL.createObjectURL(new Blob([buffer], {type: "image/png"}))
          SurfaceUtil.loadImage url, (err, img)->
            URL.revokeObjectURL(url)
            if !!err then return reject(err)
            if /^balloon([ksc])(\d+)\.png$/.test(filepath)
              [__, type, n] = /^balloon([ksc])(\d+)\.png$/.exec(filepath)
              switch type
                when "s" then balloons["sakura"][Number(n)] = {canvas: SurfaceUtil.transImage(img)}
                when "k" then balloons["kero"][Number(n)] = {canvas: SurfaceUtil.transImage(img)}
                when "c" then balloons["communicate"][Number(n)] = {canvas: SurfaceUtil.transImage(img)}
            else if /^online(\d+)\.png$/.test(filepath)
              [__, n] = /^online(\d+)\.png$/.exec(filepath)
              balloons["online"][Number(n)] = {canvas: SurfaceUtil.transImage(img)}
            else if /^arrow(\d+)\.png$/.test(filepath)
              [__, n] = /^arrow(\d+)\.png$/.exec(filepath)
              balloons["arrow"][Number(n)] = {canvas: SurfaceUtil.transImage(img)}
            else if /^sstp\.png$/.test(filepath)
              balloons["sstp"] = {canvas: SurfaceUtil.transImage(img)}
            else if /^thumbnail\.png$/.test(filepath)
              balloons["thumbnail"] = {canvas: SurfaceUtil.transImage(img)}
            resolve()
    Promise.all(promises)
      .then(-> callback(null, ))
      .catch((err)-> console.error(err, err.stack); callback(err))
    return


if module?.exports?
  module.exports = Balloon
else if @Ikagaka?
  @Ikagaka.Balloon = Balloon
else
  @Balloon = Balloon
