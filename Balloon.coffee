

class Balloon

  Nar = window["Nar"]
  Shell = window["Shell"]
  SurfaceUtil = window["SurfaceUtil"]

  constructor: (tree)->
    if !tree["descript.txt"] then throw new Error("descript.txt not found")
    @tree = tree
    @descript = Nar.parseDescript(Nar.convert(@tree["descript.txt"].asArrayBuffer()))

  load: (callback)->

  getSurface: (scopeId, surfaceId)->


    
