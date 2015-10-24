{SurfaceRender, SurfaceUtil} = require("ikagaka.shell.js")

class BalloonSurface extends EventEmitter2
  ### TypeScript Like Member Type
  element: HTMLDivElement;
  scopeId: number;
  balloon: Balloon;
  ###

  constructor: (@element, @scopeId, @balloonId, @balloon)->
    super();
    @type = SurfaceUtil.scope(@scopeId)
    @initDOMStructure()
    @initStyleFromDescript()
    @isBalloonLeft = true
    @insertPoint = @$blimpText
    @baseCanvas = @balloon.balloons[@type][@balloonId].canvas
    @render()

  initDOMStructure: ->
    BalloonSurface.prototype.initDOMStructure = ()-> console.warn("initDOMStructure method allows only 1st call")
    ### Element DOM structure in Jade
    div.blimp
      canvas.blimpCanvas
      div.blimpText
    ###
    @$blimp = $(@element).addClass("blimp")
    @$blimpCanvas = $("<canvas width='0' height='0' />").addClass("blimpCanvas")
    @$blimpText = $("<div />").addClass("blimpText")
    @$blimp.append(@$blimpCanvas)
    @$blimp.append(@$blimpText)
    return

  initStyleFromDescript: ->
    BalloonSurface.prototype.initStyleFromDescript = ()-> console.warn("initStyleFromDescript method allows only 1st call")
    descript = @balloon.descript
    @_text_style =
      "cursor":          descript["cursor"] || ''
      "font.name":      (descript["font.name"] or "MS Gothic").split(/,/).map((name) -> '"'+name+'"').join(',')
      "font.height":    (descript["font.height"] or "12") + "px"
      "font.color":       @_getFontColor(descript["font.color.r"], descript["font.color.g"], descript["font.color.b"])
      "font.shadowcolor": @_getFontColor(descript["font.shadowcolor.r"], descript["font.shadowcolor.g"], descript["font.shadowcolor.b"], true)
      "font.bold":      descript["font.bold"]
      "font.italic":    descript["font.italic"]
      "font.strike":    descript["font.strike"]
      "font.underline": descript["font.underline"]

    clickable_element_style = (prefix, style_default, descript, can_ignore) =>
      "style":       if {square: true, underline: true, 'square+underline': true, none: true}[descript["#{prefix}.style"]] then descript["#{prefix}.style"] else style_default
      "font.color":  @_getFontColor(descript["#{prefix}.font.color.r"],  descript["#{prefix}.font.color.g"],  descript["#{prefix}.font.color.b"],  can_ignore)
      "pen.color":   @_getFontColor(descript["#{prefix}.pen.color.r"],   descript["#{prefix}.pen.color.g"],   descript["#{prefix}.pen.color.b"],   can_ignore)
      "brush.color": @_getFontColor(descript["#{prefix}.brush.color.r"], descript["#{prefix}.brush.color.g"], descript["#{prefix}.brush.color.b"], can_ignore)

    @_choice_style =           clickable_element_style("cursor",           "square",    descript)
    @_choice_notselect_style = clickable_element_style("cursor.notselect", undefined,   descript, true)
    @_anchor_style =           clickable_element_style("anchor",           "underline", descript)
    @_anchor_notselect_style = clickable_element_style("anchor.notselect", undefined,   descript, true)
    @$blimpText.css(@_blimpTextCSS(@_text_style))
    @_initializeCurrentStyle()
    return

  _blimpTextCSS: (styles) ->
    css = {}
    css["cursor"] = styles["cursor"]
    css["font-family"] = styles["font.name"]
    css["font-size"] = styles["font.height"]
    css["color"] = styles["font.color"]
    css["background"] = "none"
    css["outline"] = "none"
    css["border"] = "none"
    css["text-shadow"] = if styles["font.shadowcolor"] then "1px 1px 0 #{styles["font.shadowcolor"]}" else "none"
    css["font-weight"] = if styles["font.bold"] then "bold" else "normal"
    css["font-style"] = if styles["font.italic"] then "italic" else "normal"
    text_decoration = []
    if styles["font.strike"] then text_decoration.push 'line-through'
    if styles["font.underline"] then text_decoration.push 'underline'
    css["text-decoration"] = if text_decoration.length then text_decoration.join(' ') else "none"
    css["line-height"] = "1.2em"
    css

  _blimpClickableTextCSS: (styles, default_styles={}) ->
    color = styles["font.color"] || default_styles["font.color"]
    outline = if styles["pen.color"] then "solid 1px #{styles["pen.color"]}" else if default_styles["pen.color"] then "solid 1px #{default_styles["pen.color"]}" else "solid 1px #{default_styles["font.color"]}"
    background = styles["brush.color"] || default_styles["brush.color"] || default_styles["font.color"]
    border_bottom = if styles["pen.color"] then "solid 1px #{styles["pen.color"]}" else if default_styles["pen.color"] then "solid 1px #{default_styles["pen.color"]}" else "solid 1px #{default_styles["font.color"]}"
    switch styles["style"]
      when "square"
        base:
          color: color
        over:
          outline: outline
          background: background
          "border-bottom": "none"
      when "underline"
        base:
          color: color
        over:
          outline: "none"
          background: "none"
          'border-bottom': border_bottom
      when "square+underline"
        base:
          color: color
        over:
          outline: outline
          background: background
          'border-bottom': border_bottom
      when "none"
        base:
          color: color
        over:
          outline: "none"
          background: "none"
          "border-bottom": "none"
      else
        base: {}
        over: {}

  _initializeCurrentStyle: ->
    @_current_text_style = {}
    for name, value of @_text_style
      @_current_text_style[name] = value
    @_current_choice_style = {}
    for name, value of @_choice_style
      @_current_choice_style[name] = value
    @_current_choice_notselect_style = {}
    for name, value of @_choice_notselect_style
      @_current_choice_notselect_style[name] = value
    @_current_anchor_style = {}
    for name, value of @_anchor_style
      @_current_anchor_style[name] = value
    @_current_anchor_notselect_style = {}
    for name, value of @_anchor_notselect_style
      @_current_anchor_notselect_style[name] = value
    return

  _getFontColor: (r,g,b,can_ignore) ->
    rc = if r? then r.replace(/%$/,'')
    gc = if g? then g.replace(/%$/,'')
    bc = if b? then b.replace(/%$/,'')
    if (isNaN(rc) or rc < 0) and (isNaN(gc) or gc < 0) and (isNaN(bc) or bc < 0)
      if can_ignore
        return
      else
        return "rgb(0,0,0)"
    else
      return "rgb(#{r},#{g},#{b})"

  location: (x, y)->
    re = /^(@)?(-?\d*\.?\d*e?\d*)(em|%)?$/
    toparam = (r) =>
      unless r? and r.length
        return relative: true, value: 0
      rp = r.match(re)
      unless rp then return
      if isNaN(rp[2]) then return
      if rp[3] == '%'
        value = rp[2] / 100
        unit = 'em'
      else
        value = Number rp[2]
        unit = rp[3] || 'px'
      relative: !!rp[1]
      value: value + unit
    xp = toparam x
    yp = toparam y
    unless xp? and yp? then return
    if xp.relative or yp.relative
      $imp_position_checker = $('<span>.</span>')
      @insertPoint.append($imp_position_checker)
      offset = $imp_position_checker.offset()
      baseoffset = @$blimpText.offset()
      offsetx = offset.left - baseoffset.left
      offsety = offset.top - baseoffset.top + @$blimpText.scrollTop()
      $imp_position_checker.remove()
    unless xp.relative then offsetx = 0
    unless yp.relative then offsety = 0
    $newimp_container_top = $('<div />').css('position': 'absolute', 'pointer-events': 'none', 'top': yp.value)
    $newimp_container = $('<div />').css('position': 'absolute', 'pointer-events': 'none', 'text-indent': offsetx + 'px', 'top': offsety + 'px', 'width': @$blimpText[0].clientWidth)
    $newimp = $('<span />').css('pointer-events': 'auto', 'margin-left': xp.value)
    @insertPoint = $newimp.appendTo($newimp_container.appendTo($newimp_container_top.appendTo(@$blimpText)))
    @insertPoint.css(@_blimpTextCSS(@_current_text_style))

  destructor: ->
    return

  render: ->
    # canvasに指定の背景画像を描画
    rndr = new SurfaceRender(@$blimpCanvas[0])
    rndr.init(@baseCanvas)
    # 大きさ調整
    @$blimp.width @$blimpCanvas[0].width
    @$blimp.height @$blimpCanvas[0].height
    # テキスト領域を計算
    descript = @balloon.descript
    t = descript["origin.y"]         or descript["validrect.top"] or "10"
    r = descript["validrect.right"]  or "10"
    b = descript["validrect.bottom"] or "10"
    l = descript["origin.x"]         or descript["validrect.left"] or "10"
    w = @$blimpCanvas[0].width
    h = @$blimpCanvas[0].height
    @$blimpText.css({
      "top": "#{t}px",
      "left": "#{l}px",
      "width": "#{w-(Number(l)+Number(r))}px",
      "height": "#{h-(Number(t)-Number(b))}px"
    })
    return

  left: ()->
  right: ()->
    
  anchorBegin: (id, args...)=>
    @$blimpText.find(".blink").hide()
    @$blimp.show()
    _id = $(document.createElement("div")).text(id).html()
    $a = $("<a />")
    $a.addClass("ikagaka-anchor")
    text_css = @_blimpTextCSS(@_current_text_style)
    anchor_css = @_blimpClickableTextCSS(@_current_anchor_style)
    anchor_notselect_css = @_blimpClickableTextCSS(@_current_anchor_notselect_style, @_current_anchor_style)
    $a.css(text_css).css(anchor_css.base).css(anchor_notselect_css.base).css(anchor_notselect_css.over)
    $a.mouseover(=> $a.css(anchor_css.over))
    $a.mouseout(=> $a.css(text_css).css(anchor_css.base).css(anchor_notselect_css.base).css(anchor_notselect_css.over))
    $a.attr("data-id", _id)
    $a.attr("data-argc", args.length)
    for argv, index in args
      $a.attr("data-argv#{index}", argv)
    @originalInsertPoint = @insertPoint
    @insertPoint = $a.appendTo(@insertPoint)
    return

  anchorEnd: =>
    @insertPoint = @originalInsertPoint
    return

  choice: (text, id, args...)=>
    @$blimpText.find(".blink").hide()
    @$blimp.show()
    _text = $(document.createElement("div")).text(text).html()
    _id = $(document.createElement("div")).text(id).html()
    $a = $("<a />")
    $a.addClass("ikagaka-choice")
    text_css = @_blimpTextCSS(@_current_text_style)
    choice_css = @_blimpClickableTextCSS(@_current_choice_style)
    choice_notselect_css = @_blimpClickableTextCSS(@_current_choice_notselect_style, @_current_text_style)
    $a.css(text_css).css(choice_notselect_css.base).css(choice_notselect_css.over)
    $a.mouseover(=> $a.css(choice_css.base).css(choice_css.over))
    $a.mouseout(=> $a.css(text_css).css(choice_notselect_css.base).css(choice_notselect_css.over))
    $a.html(_text)
    $a.attr("data-id", _id)
    $a.attr("data-argc", args.length)
    for argv, index in args
      $a.attr("data-argv#{index}", argv)
    $a.appendTo(@insertPoint)
    return

  choiceBegin: (id, args...)=>
    @$blimpText.find(".blink").hide()
    @$blimp.show()
    _id = $(document.createElement("div")).text(id).html()
    $a = $("<a />")
    $a.addClass("ikagaka-choice")
    text_css = @_blimpTextCSS(@_current_text_style)
    choice_css = @_blimpClickableTextCSS(@_current_choice_style)
    choice_notselect_css = @_blimpClickableTextCSS(@_current_choice_notselect_style, @_current_text_style)
    $a.css(text_css).css(choice_notselect_css.base).css(choice_notselect_css.over)
    $a.mouseover(=> $a.css(choice_css.base).css(choice_css.over))
    $a.mouseout(=> $a.css(text_css).css(choice_notselect_css.base).css(choice_notselect_css.over))
    $a.attr("data-id", _id)
    $a.attr("data-argc", args.length)
    for argv, index in args
      $a.attr("data-argv#{index}", argv)
    @originalInsertPoint = @insertPoint
    @insertPoint = $a.appendTo(@insertPoint)
    return

  choiceEnd: =>
    @insertPoint = @originalInsertPoint
    return

  talk: (text)=>
    @$blimpText.find(".blink").hide()
    _text = $(document.createElement("div")).text(text).html()
    if !!@currentSurface
      @currentSurface.talk()
    @$blimp.show()
    @insertPoint.append(_text)
    @$blimpText[0].scrollTop = 999
    return

  talkraw: (text)=>
    @$blimpText.find(".blink").hide()
    if !!@currentSurface
      @currentSurface.talk()
    @$blimp.show()
    @insertPoint.append(text)
    @$blimpText[0].scrollTop = 999
    return

  marker: =>
    @$blimpText.find(".blink").hide()
    _text = $(document.createElement("div")).text("・").html()
    @$blimp.show()
    @insertPoint.append(_text)
    @$blimpText[0].scrollTop = 999
    return

  clear: =>
    @$blimpText.html("")
    @insertPoint = @$blimpText
    @_initializeCurrentStyle()
    return

  br: (ratio) =>
    if ratio?
      @location('0', '@' + ratio + 'em')
    else
      @insertPoint.append("<br />")
    return

  showWait: =>
    @$blimpText.append("<br /><br />").append("<div class='blink'>▼</div>")
    @$blimpText[0].scrollTop = 999
    return

  font: (name, values...) =>
    value = values[0]
    treat_bool = (name, value) =>
      if value == 'default'
        @_current_text_style["font.#{name}"] = @_text_style["font.#{name}"]
      else
        @_current_text_style["font.#{name}"] = not ((value == 'false') or ((value - 0) == 0))
    treat_clickable_styles = (treat_name, name, value, values, _current_style, _style) =>
      switch name
        when "#{treat_name}style"
          if value == 'default'
            _current_style["style"] = _style["style"]
          else
            _current_style["style"] = value
        when "#{treat_name}fontcolor"
          if value == 'default'
            _current_style["font.color"] = _style["font.color"]
          else if values[0]? and values[1]? and values[2]?
            _current_style["font.color"] = @_getFontColor(values[0], values[1], values[2])
          else
            _current_style["font.color"] = value
        when "#{treat_name}pencolor"
          if value == 'default'
            _current_style["pen.color"] = _style["pen.color"]
          else if values[0]? and values[1]? and values[2]?
            _current_style["pen.color"] = @_getpenColor(values[0], values[1], values[2])
          else
            _current_style["pen.color"] = value
        when "#{treat_name}color", "#{treat_name}brushcolor"
          if value == 'default'
            _current_style["brush.color"] = _style["brush.color"]
          else if values[0]? and values[1]? and values[2]?
            _current_style["brush.color"] = @_getFontColor(values[0], values[1], values[2])
          else
            _current_style["brush.color"] = value
    switch name
      when 'name'
        is_text_style = true
        @_current_text_style["font.name"] = values.map((name) -> '"'+name+'"').join(',')
      when 'height'
        is_text_style = true
        if value == 'default'
          @_current_text_style["font.height"] = @_text_style["font.height"]
        else if /^[+-]/.test(value)
          $size_checker = $('<span />').text('I').css(position: 'absolute', visibility: 'hidden', 'width': '1em', 'font-size': '1em', padding: 0, 'line-height': '1em')
          @insertPoint.append($size_checker)
          size = $size_checker[0].clientHeight
          $size_checker.remove()
          @_current_text_style["font.height"] = (Number(size) + Number(value)) + 'px'
        else if not isNaN(value)
          @_current_text_style["font.height"] = value + 'px'
        else
          @_current_text_style["font.height"] = value
      when 'color'
        is_text_style = true
        if value == 'default'
          @_current_text_style["font.color"] = @_text_style["font.color"]
        else if values[0]? and values[1]? and values[2]?
          @_current_text_style["font.color"] = @_getFontColor(values[0], values[1], values[2])
        else
          @_current_text_style["font.color"] = value
      when 'shadowcolor'
        is_text_style = true
        if value == 'default'
          @_current_text_style["font.shadowcolor"] = @_text_style["font.shadowcolor"]
        else if value == 'none'
          @_current_text_style["font.shadowcolor"] = undefined
        else if values[0]? and values[1]? and values[2]?
          @_current_text_style["font.shadowcolor"] = @_getFontColor(values[0], values[1], values[2])
        else
          @_current_text_style["font.shadowcolor"] = value
      when 'bold'
        is_text_style = true
        treat_bool 'bold', value
      when 'italic'
        is_text_style = true
        treat_bool 'italic', value
      when 'strike'
        is_text_style = true
        treat_bool 'strike', value
      when 'underline'
        is_text_style = true
        treat_bool 'underline', value
      when 'default'
        is_text_style = true
        @_initializeCurrentStyle()
      when 'cursorstyle', 'cursorfontcolor', 'cursorpencolor', 'cursorcolor', 'cursorbrushcolor'
        treat_clickable_styles('cursor', name, value, values, @_current_choice_style, @_choice_style)
      when 'anchorstyle', 'anchorfontcolor', 'anchorpencolor', 'anchorcolor', 'anchorbrushcolor'
        treat_clickable_styles('anchor', name, value, values, @_current_anchor_style, @_anchor_style)
      when 'cursornotselectstyle', 'cursornotselectfontcolor', 'cursornotselectpencolor', 'cursornotselectcolor', 'cursornotselectbrushcolor'
        treat_clickable_styles('cursornotselect', name, value, values, @_current_choice_notselect_style, @_choice_notselect_style)
      when 'anchornotselectstyle', 'anchornotselectfontcolor', 'anchornotselectpencolor', 'anchornotselectcolor', 'anchornotselectbrushcolor'
        treat_clickable_styles('anchornotselect', name, value, values, @_current_anchor_notselect_style, @_anchor_notselect_style)
    if is_text_style
      $newimp = $('<span />')
      @insertPoint = $newimp.appendTo(@insertPoint)
      @insertPoint.css(@_blimpTextCSS(@_current_text_style))
    return


exports.BalloonSurface = BalloonSurface
