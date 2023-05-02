/*
    ski.js
    version 1.9.0
*/

var CORNER, CENTER, CLOSE, SPACE, LEFT, RIGHT, UP, DOWN, SQUARE, ROUND, PROJECT, MITER, BEVEL, DEGREES, RADIANS, PI, TAU, RGBA, HSL, HEX, LEFT_BUTTON, RIGHT_BUTTON, ESCAPE, TAB, SHIFT, CONTROL, ALT, ENTER, BACKSPACE, fps, skiJSData, canvas, ctx, mousePressed, mouseReleased, mouseScrolled, mouseClicked, mouseOver, mouseOut, mouseMoved, mouseIsPressed, mouseButton, mouseX, mouseY, pmouseX, pmouseY, keyPressed, keyReleased, keyTyped, key, keyIsPressed, keyCode, width, height

// constants
// KeyEvent.keyCode values
BACKSPACE = 8
TAB = 9
ENTER = 13
SHIFT = 16
CONTROL = 17
ALT = 18
ESCAPE = 27
SPACE = 32
LEFT = 37
RIGHT = 39
UP = 38
DOWN = 40
//mostly for drawin' stuff on the canvas
CORNER = 0
CENTER = 1
CLOSE = true
SQUARE = atob("YnV0dA==") //yeah, srsly.
ROUND = "round"
PROJECT = "square"
MITER = "iter"
BEVEL = "bevel"
DEGREES = "deg"
RADIANS = "rad"
PI = Math.PI
TAU = PI * 2
RGBA = "rgba"
HSL = "hsl"
HEX = "hex"
LEFT_BUTTON = 0
RIGHT_BUTTON = 2

// setup the canvas
canvas = null
ctx = null

//all canvas-related functions
/**
 * sets the canvas width an' height.
 * @param {number} w - width
 * @param {number} h - height
 * @param {boolean} [css=false] - whether to set the dimensions of the canvas or just the resolution
 * @example
 * size(600, 600)
 * //resizes the resolution of the canvas to 600px by 600px
 * size(600, 600, true)
 * //resizes the resolution an' dimension of the canvas to 600px by 600px
**/
function size (w, h, css) {
    if (!canvas || !ctx) {
        canvas = document.querySelectorAll("canvas,canvas.skijs,canvas[data-skijs]")[0]
        set(canvas)
    }
    width = canvas.width = w
    height = canvas.height = h
    css && (canvas.style.width = `${w}px`, canvas.style.height = `${h}px`)
}
/**
 * sets the current canvas to a different canvas, whether off or on screen
 * 
 * xxx HS16 - Now attaches the proper event listeners to the canvas.
 * 
 * @param {...(HTMLCanvasElement|OffscreenCanvas|number)} [args] - argument for the set function
 * @example
 * set() 
 * //sets the canvas to a new OffscreenCanvas with the same width an' height of the current canvas
 * set(document.getElementsByTagName("canvas")[0]) 
 * //set the canvas to the first canvas element in the DOM
 * set(400, 400) 
 * //sets the canvas to a new OffscreenCanvas with dimensions 400px by 400px
**/
function set (...args) {
    switch (args.length) {
        case 0:
            rejectCanvas()
            canvas = new OffscreenCanvas(width, height)
            ctx = canvas.getContext("2d")
            adoptCanvas();
            return [canvas, ctx]
            break
        case 1:
            rejectCanvas()
            canvas = args[0]
            ctx = canvas.getContext("2d")
            width = canvas.width
            height = canvas.height
            adoptCanvas();
            break
        case 2:
            rejectCanvas()
            canvas = new OffscreenCanvas(args[0], args[1])
            ctx = canvas.getContext("2d")
            width = args[0]
            height = args[1]
            adoptCanvas()
            return [canvas, ctx]
    }
}
/**
 * sets the background for the canvas
 * @param {...(string|number|Array)} args
 * @see {@link color} for the definition of the arguments
**/
function background (...args) {
    const cache = [ctx.strokeStyle, ctx.fillStyle]
    const matrix = ctx.getTransform()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.strokeStyle = "rgba(0, 0, 0, 0)"
    ctx.fillStyle = color(...args)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = cache[0]
    ctx.fillStyle = cache[1]
    ctx.setTransform(matrix)
}
/**
 * sets the fill color for the shapes following the call
 * @param {...(string|number|Array)} args
 * @see {@link color} for the definition of the arguments
**/
function fill (...args) {
    ctx.fillStyle = color(...args)
}
/**
 * sets the fill color for the shapes following the call
 * @param {...(string|number|Array)} args
 * @see {@link color} for the definition of the arguments
**/
function stroke (...args) {
    ctx.strokeStyle = color(...args)
}
/**
 * draws an ImageData object, HTMLCanvasElement, or HTMLImageElement on the canvas
 * @param {(HTMLCanvasElement|ImageData|HTMLImageElement)} img image to be drawn
 * @param {number} x
 * @param {number} y
 * @param {number} [w=img.width] - the width of the image. defaults to the width of the image. i mean what else would it default too lol?
 * @param {number} [h=img.height] - the height of the image. defaults to the height of the image. i mean what else would it default too lol?
 * @example
 * image(img, 0, 0) 
 * //draws the image at (0, 0) with the default width an' height
 * image(img, 0, 0) 
 * //draws the image at (0, 0) with the dimensions 400px by 400px
**/
function image (img, x, y, w = img.width, h = img.height) {
    [x, y] = skiJSData.pos("image", x, y, w, h)
    if(img instanceof ImageData) ctx.putImageData(img, x, y, w, h)
    else ctx.drawImage(img, x, y, w, h)
}
/**
 * draws a clear rectangle across the entire canvas
**/
function clear () {
    const matrix = ctx.getTransform()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.setTransform(matrix)
}
/**
 * removes any stroke from the shapes to be drawn after the function call
**/
function noStroke () {
    ctx.strokeStyle = color(0, 0)
}
/**
 * removes any stroke from the shapes to be drawn after the function call
**/
function noFill () {
    ctx.fillStyle = color(0, 0)
}
/**
 * draws a rectangle on the canvas
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {...number} radius - radius or radii. basically works the same as [`ctx.roundRect`]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect}
 * @example
 * rect(0, 0, 10, 10) 
 * //draws a rectangle at (0, 0) with dimensions 10px by 10px
**/
function rect (x, y, width, height, ...radius) {
    [x, y] = skiJSData.pos("rect", x, y, width, height)
    if (radius.length > 0) {
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, ...radius)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    } else {
        ctx.fillRect(x, y, width, height)
        ctx.strokeRect(x, y, width, height)
    }
}
/**
 * i see absolutely no reason why you would document this, .-.
 * it's a helper function for the [text function]{@link text}.
 * 
 * @param {string} str - a string
 * @param {number} width -  the width of the text
 * 
 * @returns {string} - the string with proper line breaks.
**/
function wrapText (str, width) {
    str = str.split(/[ ]/)
    let i = 0, phrase = "", result = ""
    while(i < str.length){
        const frag = str[i]
        const newLineCharIndex = frag.indexOf("\n")
        if(newLineCharIndex >= 0){
           phrase += frag.slice(0, newLineCharIndex + 1)
           result += phrase
           phrase = frag.slice(newLineCharIndex + 1, frag.length) + " "
        }
        else {
            phrase += frag + " "
            if(textWidth(phrase) > width){
                result += phrase + "\n"
                phrase = ""
            }
        }
        i++
    }
    if(phrase.length > 0){
        result += "\n" + phrase
    }
    return result
}
/**
 * displays text on the canvas
 * @param {!*} msg the message you want to display can be anythin' but null.
 * @param {number} x
 * @param {number} y
 * @param {number} [w] width
 * @param {number} [h] height - (this doesn't do anythin')
 * @example
 * textAlign(CENTER, CENTER)
 * text("hello there!", width / 2, height / 2) 
 * //draws "hello there!" on the center of the canvas
 * text("hello there!", width / 2, height / 2, 200, 100) 
 * //draws "hello there!" on the center of the canvas with a maximum width of 200px
**/
function text (msg, x, y, w, h) {
    msg = msg?.toString()
    if(w) msg = wrapText(msg, w)
    if (msg.includes("\n")) {
        msg.split("\n").map((p, i) => {
            ctx.fillText(p, x, y + ((i - ((msg.split("\n")).length - 1) / 2) * (skiJSData.height + skiJSData.leading)))
            ctx.strokeText(p, x, y + ((i - ((msg.split("\n")).length - 1) / 2) * (skiJSData.height + skiJSData.leading)))
        })
    } else {
        ctx.fillText(msg, x, y)
        ctx.strokeText(msg, x, y)
    }
}
/**
 * sets the positionin' mode for rectangles
 * @param {number} [m=CORNER] - mode; please only use CORNER an' CENTER or 0 an' 1
 * @example
 * rectMode(CORNER)
 * //draws rectangles from the top-left corner
 * rectMode(CENTER)
 * //draws rectangles from their center
**/
function rectMode (m) {
    skiJSData.rect = m
}
/**
 * sets the positionin' mode for ellipses
 * @param {number} [m=CENTER] - mode; please only use CORNER an' CENTER or 0 an' 1
 * @example
 * ellipseMode(CORNER)
 * //draws ellipses from the top-left corner
 * ellipseMode(CENTER)
 * //draws ellipses from their center
**/
function ellipseMode (m) {
    skiJSData.ellipse = m
}
/**
 * sets the positionin' mode for arcs
 * @param {number} [m=CENTER] - mode; please only use CORNER an' CENTER or 0 an' 1
 * @example
 * arcMode(CORNER)
 * //draws arcs from the top-left corner
 * arcMode(CENTER)
 * //draws arcs from their center
**/
function arcMode (m) {
    skiJSData.arc = m
}
/**
 * sets the positionin' mode for images
 * @param {number} [m=CORNER] - mode; please only use CORNER an' CENTER or 0 an' 1
 * @example
 * imageMode(CORNER)
 * //draws rectangles from the top-left corner
 * imageMode(CENTER)
 * //draws rectangles from their center
**/
function imageMode (m) {
    skiJSData.image = m
}
/**
 * aligns the text drawn on the canvas
 * @param {number} [horiztonal=CORNER] - horizontal alignment
 * @param {number} [vertical=CORNER] - vertical alignment
 * @example
 * textAlign(CENTER, CENTER)
 * //text will now be drawn from the center
**/
function textAlign (horizontal, vertical) {
    //println(horizontal === CENTER, vertical === CENTER)
    ctx.textAlign = horizontal === CENTER ? "center" : "start"
    ctx.textBaseline = vertical === CENTER ? "middle" : "hanging"
}
/**
 * do NOT use this function! this is simply for PJS compatibility.
 * it's useless, just returns whatever you input as an argument.
 * @param {string} font
 * @return {string} font
**/
function createFont (font) {
    return font
}
/**
 * sets the font size for any text drawn
 * @param {number} size
 * @example
 * textSize(20) 
 * //text will be drawn at 20px
**/
function textSize (size) {
    skiJSData.height = size
    ctx.font = skiJSData.fontString(skiJSData.font, size)
}
/**
 * sets the font for any text drawn
 * @param {string} font - the name of the font
 * @param {number} [size] - the size of the font in px
 * @example
 * textFont("Arial", 12) 
 * //font is arial with size 12px
**/
function textFont (font, size = skiJSData.height) {
    skiJSData.height !== size && (skiJSData.height = size)
    skiJSData.flags = []
    if ((/bold/i).test(font)) {
        skiJSData.flags.push("bold")
        font = font.replace("bold", '')
    }
    if ((/italic/i).test(font)) {
        skiJSData.flags.push("italic")
        font = font.replace("italic", '')
    }
    font = font.trim()
    skiJSData.font = font
    ctx.font = skiJSData.fontString(font, size)
}
/**
 * sets the space between text on the y-axis
 * @param {number} val - leading in pix
**/
function textLeading (val) {
    skiJSData.leading = val
}
/**
 * find the width of a string given the current font an' font size
 * for strings with line breaks, it finds the largest width
 * @param {string} txt - text
**/
function textWidth (txt) {
    return txt.split("\n").reduce((a, b) => max(a, ctx.measureText(b).width), 0)
}
/**
 * i honestly don't know. just ported the concept from PJS.
**/
function textAscent () {
    return ctx.measureText("a").fontBoundingBoxAscent
}
/**
 * i honestly don't know. just ported the concept from PJS.
**/
function textDescent () {
    ctx.measureText("a").fontBoundingBoxDescent
}
/**
 * sets the stroke cap. see [`ctx.lineCap`]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap}
 * @param {string} mode - line cap value; use ski.js constants
**/
function strokeCap (mode) {
    ctx.lineCap = mode
}
/**
 * sets the stroke cap. see [`ctx.lineJoin`]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin}
 * @param {string} mode - line join value; use ski.js constants
**/
function strokeJoin (mode) {
    ctx.lineJoin = mode
}
/**
 * sets the stroke cap. see [`ctx.lineWidth`]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth}
 * @param {string} weight - line width value; use ski.js constants
**/
function strokeWeight (weight) {
    ctx.lineWidth = weight
}
/**
 * saves the current state of the canvas
**/
function pushStyle () {
    ctx.save()
}
/**
 * restores the saved state of the canvas
**/
function popStyle () {
    ctx.restore()
}
/**
 * save the current transformation matrix state
**/
function pushMatrix () {
    const { matrices: arr, matrixToArray: convert } = skiJSData
    arr.push(convert(ctx.getTransform()))
}
/**
 * restores the saved transformation matrix state
**/
function popMatrix () {
    const arr = new Float32Array(skiJSData.matrices.pop())
    const mat = DOMMatrix.fromFloat32Array(arr)
    ctx.setTransform(mat)
}
/**
 * translate given coordinates
 * @param {number} x
 * @param {number} y
**/
function translate (x, y) {
    ctx.transform(1, 0, 0, 1, x, y)
}
/**
 * rotate given an angle
 * @param {number} ang - rotation angle
**/
function rotate (ang) {
    if(skiJSData.angle === DEGREES) ang = degrees(ang)
    const cos = Math.cos, sin = Math.sin
    ctx.transform(cos(ang), sin(ang), -sin(ang), cos(ang), 0, 0)
}
/**
 * scale given a factor
 * @param {number} w - if only one arg, the scale factor; else the x scale factor.
 * @param {number} [h] - y scale factor
**/
function scale (w, h) {
    ctx.transform(w, 0, 0, h ? h : w, 0, 0)
}
/**
 * starts a new shape
**/
function beginShape () {
    skiJSData.path = []
}
/**
 * adds a vertex to a shape
 * @param {number} x
 * @param {number} y
**/
function vertex (x, y) {
    skiJSData.path.push([x, y])
}
/**
 * adds a curve vertex to a shape
 * a quadratic curve, a singular control point an' an endpoint.
 * @param {number} cx - control x
 * @param {number} cy - control y
 * @param {number} x
 * @param {number} y
**/
function curveVertex (cx, cy, x, y) {
    skiJSData.path.push([cx, cy, x, y])
}
/**
 * adds a bezier vertex to a shape
 * a bezier curve, two control points an' one endpoint
 * @param {number} c1x - control x 1
 * @param {number} c1y - control y 1
 * @param {number} c2x - control x 2
 * @param {number} c2y - control y 2
 * @param {number} x
 * @param {number} y
**/
function bezierVertex (c1x, c1y, c2x, c2y, x, y) {
    skiJSData.path.push([c1x, c1y, c2x, c2y, x, y])
}
/**
 * ends the shape calls an' draws a shape.
 * this could be abused to draw the same shape again
 * 'cuz i don't clear the path, semi-intentionally.
 * 
 * @param {boolean} [end] - use CLOSE, closes a shape by callin' ctx.closePath
**/
function endShape (end) {
    const paths = skiJSData.path
    if (paths.length < 2 || paths[0].length !== 2) return
    ctx.beginPath()
    paths.forEach((path, index) => {
        if(index === 0){
            ctx.moveTo(...path)
        }
        else {
            if(path.length === 2) ctx.lineTo(...path)
            else if(path.length === 4) ctx.quadraticCurveTo(...path)
            else if(path.length === 6) ctx.bezierCurveTo(...path)
            else return
        }
    })
    if(end) ctx.closePath()
    ctx.fill()
    ctx.stroke()
}
/**
 * draws a curve given six points.
 * called in this order: vertex -> curveVertex
 * @param {number} sx - start x
 * @param {number} sy - start y
 * @param {number} cx - control x
 * @param {number} cy - control y
 * @param {number} ex - end x
 * @param {number} ey - end y
**/
function curve (sx, sy, cx, cy, ex, ey) {
    if (typeof ey !== "number") return
    beginShape()
    vertex(sx, sy)
    curveVertex(cx, cy, ex, ey)
    endShape()
}
/**
 * draws a curve given eight points.
 * called in this order: vertex -> bezierVertex
 * @param {number} sx - start x
 * @param {number} sy - start y
 * @param {number} c1x - control x 1
 * @param {number} c1y - control y 1
 * @param {number} c2x - contorl x 2
 * @param {number} c2y - control y 2
 * @param {number} ex - end x
 * @param {number} ey - end y
**/
function bezier (sx, sy, c1x, c1y, c2x, c2y, ex, ey) {
    if (typeof ey !== "number") return
    beginShape()
    vertex(sx, sy)
    bezierVertex(c1x, c1y, c2x, c2y, ex, ey)
    endShape()
}
/**
 * draws an arc.
 * @param {number} x
 * @param {number} y
 * @param {number} w - width
 * @param {number} h - width
 * @param {number} start - start angle
 * @param {number} stop - stop angle
 * @param {boolean} [close=false] - call endShape(CLOSE)
**/
function arc (x, y, w, h, start, stop, close = false) {
    [x, y] = skiJSData.pos("arc", x, y, width, height)
    pushMatrix()
    translate(x, y)
    if(w !== h){
        if(w > h) scale(max(w, h) / min(w, h), 1)
        else scale(1, max(w, h) / min(w, h))
    }
    ctx.beginPath()
    if(ctx.fillStyle !== color(0, 0)) ctx.moveTo(0, 0)
    ctx.arc(0, 0, min(w, h) / 2, degrees(start), degrees(stop))
    if(close) ctx.closePath()
    popMatrix()
    ctx.fill()
    ctx.stroke()
}
/**
 * draws an ellipse or circle
 * @param {number} x
 * @param {number} y
 * @param {number} w - width
 * @param {number} h - height
**/
function ellipse (x, y, w, h) {
    ctx.beginPath()
    ctx.ellipse(x, y, w / 2, h / 2, 0, 0, TAU)
    ctx.fill()
    ctx.stroke()
}
/**
 * draws a quadrilateral usin' vertex
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {number} x4
 * @param {number} y4
**/
function quad (x1, y1, x2, y2, x3, y3, x4, y4) {
    beginShape()
    vertex(x1, y1)
    vertex(x2, y2)
    vertex(x3, y3)
    vertex(x4, y4)
    endShape(CLOSE)
}
/**
 * draws a triangle
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
**/
function triangle (x1, y1, x2, y2, x3, y3) {
    beginShape()
    vertex(x1, y1)
    vertex(x2, y2)
    vertex(x3, y3)
    endShape(CLOSE)
}
/**
 * draws a point with stroke
 * @param {number} x
 * @param {number} y
**/
function point (x, y) {
    if (ctx.strokeStyle !== color(0, 0)) {
        const cache = [ctx.strokeStyle, ctx.fillStyle]
        noStroke()
        ctx.fillStyle = cache[0]
        ellipse(x, y, ctx.lineWidth, ctx.lineWidth)
        ctx.strokeStyle = cache[0]
        ctx.fillStyle = cache[1]
    }
}
/**
 * draws a line
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
**/
function line (x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()
    ctx.stroke()
}
/**
 * returns the ImageData for the given canvas, coordinates an' dimensions
 * @param {...(number|HTMLCanvasElement|OffscreenCanvas)} args - [x, y, width, height, sourceCanvas]
 * @returns {(ImageData|string)} - the color or ImageData object
 * @example
 * get()
 * //same as get(0, 0, width, height)
 * get(0, 0)
 * //returns the color of the pixel at (0, 0)
 * get(canvas, 0, 0)
 * //returns the color of the pixel at (0, 0) on canvas
 * get(0, 0, 20, 20)
 * //returns the ImageData object for (0, 0) with dimensions 20px by 20px
 * get(canvas, 0, 0, 20, 20)
 * //returns the ImageData object for (0, 0) with dimensions 20px by 20px on canvas
**/
function get (...args) {
    const [x, y, w, h, src] = args
    switch (args.length) {
        case 0:
            return get(0, 0, width, height)
        break
        case 2:
            data = ctx.getImageData(x, y, 1, 1).data
            return color(data[0], data[1], data[2], data[3])
        break
        case 3: {
            const canvas = new OffscreenCanvas(w.width, w.height)
            const ctx = canvas.getContext("2d")
            if (w instanceof HTMLImageElement) {
                ctx.drawImage(w, 0, 0)
                data = ctx.getImageData(x, y, 1, 1)
            } else {
                data = w.getContext("2d").getImageData(x, y, 1, 1).data
            }
            return color(data[0], data[1], data[2], data[3])
        }
        break
        case 4: 
            const imageCanvas = new OffscreenCanvas(w, h)
            const context = imageCanvas.getContext("2d")
            context.putImageData(ctx.getImageData(x, y, w, h), 0, 0)
            return imageCanvas
        break
        case 5: {
            const canvas = new OffscreenCanvas(src.width, src.height)
            const ctx = canvas.getContext("2d")
            ctx.drawImage(src, -x, -y)
            return canvas
        }
    }
}
/**
 * masks the previous graphics over the followin' graphics
 * @example
 * set(width, height)
 * clear()
 * //masking shape
 * mask()
 * //shapes to be masked
 * const img = get(0, 0, width, height)
 * set(document.getElementsByTagName("canvas")[0])
 * image(img, 0, 0)
**/
function mask () {
    ctx.globalCompositeOperation = "source-atop"
}

// event handlers
mouseReleased = () => {}
mouseScrolled = () => {}
mouseClicked = () => {}
mouseOut = () => {}
mouseOver = () => {}
mouseMoved = () => {}
keyPressed = () => {}
keyReleased = () => {}
keyTyped = () => {}
mouseIsPressed = false
mouseButton = LEFT_BUTTON
mouseX = 0
mouseY = 0
pmouseX = mouseX
pmouseY = mouseY

/**
 * Attaches event handlers to the current canvas
 */
function adoptCanvas() {
    // xxx HS16 - Bind handlers ONLY to the canvas, so a ski.js
    // program can be hosted on a website that needs scrolling.
    canvas.tabIndex = -1
    canvas.onmousedown = e => {
        mousePressed(e)
        mouseIsPressed = true
        mouseButton = e.button
    }
    canvas.onmousemove = e => {
        const rect = canvas.getBoundingClientRect()
        pmouseX = mouseX
        pmouseY = mouseY
        mouseX = constrain(e.pageX - rect.x, 0, width)
        mouseY = constrain(e.pageY - rect.y, 0, height)
        mouseMoved(e)
    }
    canvas.onmouseup = e => {
        mouseReleased(e)
        mouseClicked(e)
        mouseButton = e.button
        mouseIsPressed = false
        e.preventDefault()
    }
    canvas.oncontextmenu = e => e.preventDefault()
    canvas.onmouseover = e => mouseOver(e)
    canvas.onmouseout = e => mouseOut(e)
    canvas.onwheel = e => {
        mouseScrolled(e)
        e.preventDefault()
    }
    canvas.onkeydown = e => {
        e.preventDefault()
        key = e.key
        keyCode = e.keyCode
        keyIsPressed = true
        keyPressed(e)        
    }
    canvas.onkeyup = e => {        
        e.preventDefault()
        key = e.key
        keyCode = e.keyCode
        keyReleased(e)        
    }
    canvas.onkeypress = e => {        
        e.preventDefault()
        key = e.key
        keyCode = e.keyCode
        keyTyped(e)        
    }
}

/**
 * Removes all event listeners from a canvas, in anticipation
 * of a new host.
 */
function rejectCanvas() {
    if (!canvas) return;
    canvas.onmousedown = null
    canvas.onmousemove = null
    canvas.onmouseup   = null
    canvas.oncontextmenu = null
    canvas.onmouseover = null
    canvas.onmouseout  = null
    canvas.onwheel     = null
    canvas.onkeydown   = null
    canvas.onkeyup     = null
    canvas.onkeypress  = null
}

// data used by ski.js
skiJSData = {
    //canvas-related
    rect: CORNER,
    ellipse: CENTER,
    arc: CENTER,
    image: CORNER,
    leading: 0,
    height: 12,
    flags: [],
    fontString(font, size) {
        let flags = ""
        if(this.flags.includes("bold")) flags += "bold "
        if(this.flags.includes("italics")) flags += "italics "
        return (flags + `${size}px ` + font)
    },
    pos(type, x, y, w, h) {
        return type === "rect" || type === "image" ? this[type] < 1 ? [x, y] : [x - w / 2, y - h / 2] : this[type] < 1 ? [x + w / 2, y + w / 2] : [x, y]
    },
    matrixToArray(matrix) {
        return ["a", "b", "c", "d", "e", "f"].map(el => matrix[el])
    },
    matrices: [],
    path: [],
    //non-canvas related
    rate: 60,
    millis: 0,
    start: 0,
    draw: 0,
    angle: DEGREES,
    color: RGBA,
}

// FPS
fps = 60

// miscellaneous
/**
 * alias for console.debug
 * @param {...*} args
 * 
**/
function debug (...args) {
    console.debug(...args)
}
/**
 * alias for console.assert
 * @param {...*} args
**/
function isEqual (...args) {
    console.assert(...args)
}
/**
 * returns the day
 * @returns {number} - day
**/
function day () {
    return (new Date).getDate()
}
/**
 * returns the month
 * @returns {number} - month
**/
function month () {
    return (new Date).getMonth()
}
/**
 * returns the year
 * @returns {number} - year
**/
function year () {
    return (new Date).getYear()
}
/**
 * returns the hours
 * @returns {number} - hours
**/
function hour () {
    return (new Date).getHours()
}
/**
 * returns the minutes
 * @returns {number} - minutes
**/
function minute () {
    return (new Date).getMinutes()
}
/**
 * returns the seconds
 * @returns {number} - seconds
**/
function seconds () {
    return (new Date).getSeconds()
}
/**
 * enables the context menu, so you can right-click an' save the canvas as an image.
**/
function enableContextMenu () {
    canvas.oncontextmenu = true
}
/**
 * alias for document.body.style.cursor
 * @param {string} name - name of the cursor
**/
function cursor (name) {
    document.body.style.cursor = name
}
/**
 * enables image smoothing
**/
function smooth () {
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
}
/**
 * disables image smoothing
**/
function noSmooth () {
    ctx.imageSmoothingEnabled = false
    ctx.imageSmoothingQuality = "low"
}
/**
 * disables the draw function
**/
function noLoop () {
    skiJSData.draw = draw
    draw = 0
}
/**
 * enables the draw function
**/
function loop () {
    draw = skiJSData.draw || draw
}

// math
/**
 * returns the maximum value from two values
 * does not find the maximum of all values for efficiency's sake
 * if such a function is necessary, this will do in a pinch:
 * const maxAll = (...args) => args.reduce((a, b) => max(a, b), 0)
 * @param {number} a
 * @param {number} b
 * @return {number} - the maximum
**/
function max (a, b) {
    return a > b ? a : b
}
/**
 * returns the minimum value from two values
 * does not find the minimum of all values for efficiency's sake
 * if such a function is necessary, this will do in a pinch:
 * const minAll = (...args) => args.reduce((a, b) => min(a, b), 0)
 * @param {number} a
 * @param {number} b
 * @return {number} - the minimum
**/
function min (a, b) {
    return a < b ? a : b
}
/**
 * returns the magnitude of two values
 * @param {number} a
 * @param {number} b
 * @returns {number} - the magnitude
**/
function mag (a, b) {
    return Math.sqrt((a ** 2) + (b ** 2))
}
/**
 * returns the euclidean distance between two coordinates
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number} - the euclidean distance
**/
function dist (x1, y1, x2, y2) {
    return mag(x2 - x1, y2 - y1)
}
/**
 * returns the manhattan distance between two coordinates
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number} - the euclidean distance
**/
function manhattanDistance (x1, y1, x2, y2) {
    return abs(x1 - x2) + abs(y1 - y2)
}
/**
 * returns the chebyshev distance between two coordinates
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number} - the euclidean distance
**/
function chebyshevDistance (x1, y1, x2, y2) {
    return max(abs(x1 - x2), abs(y1 - y2))
}
/**
 * take the natural number to a number n
 * @param {number} n - power to raise the natural number to
 * @returns {number}
**/
function exp (n) {
    return Math.E ** n
}
/**
 * normalizes a value
 * @param {number} val - value to normalize
 * @param {number} low - lowest value
 * @param {number} high - highest value
 * @returns {number} - the normalized value
**/
function norm (val, low, high) {
    return (val - low) / (high - low)
}
/**
 * map a value to two ranges
 * @param {number} val - value to normalize
 * @param {number} a - lowest value of range 1
 * @param {number} b - highest value of range 1
 * @param {number} c - lowest value of range 2
 * @param {number} d - highest value of range 2
 * @returns {number} - the mapped value
**/
function map (val, a, b, c, d) {
    return c + (d - c) * norm(val, a, b)
}
/**
 * linearly interpolates a value
 * @param {number} val - value to interpolate
 * @param {number} targ - value to interpolate to
 * @param {number} amt - amount to interpolate by
 * @returns {number} - interpolated value
**/
function lerp (val, targ, amt) {
    return ((targ - val) * amt) + val
}
/**
 * returns a random value usin' Math.random
 * @param {number} [min] - if max, minimum value generated; else, maximum value generated with the minimum value being 0
 * @param {number} [max] - maximum value generated
 * @returns {number} - random value
**/
function random (min, max) {
    if(max) return Math.random() * (max - min) + min
    else if(min) return Math.random() * min
    else return Math.random()
}
/**
 * constrain a value between two values
 * @param {number} val - value to be constrained
 * @param {number} low - lowest value that the value can be
 * @param {number} high - highest value that the value can be
 * @returns {number} - constrained value
**/
function constrain (val, low, high) {
    return min(max(val, low), high)
}
/**
 * returns the logarithm of a number
 * alias for Math.log
 * @param {number} n
 * @returns {number}
**/
function log (n){
    return Math.log(n)
}
/**
 * returns the square root of a number
 * alias for Math.sqrt
 * @param {number} n
 * @returns {number}
**/
function sqrt (n) {
    return Math.sqrt(n)
}
/**
 * returns the square of a number
 * alias for n ** 2
 * @param {number} n
 * @returns {number}
**/
function sq (n) {
    return n ** 2
}
/**
 * returns the result of a base an' a power
 * alias for a ** b
 * @param {number} a - base
 * @param {number} b - power
 * @returns {number}
**/
function pow (a, b) {
    return a ** b
}
/**
 * returns the absolute value of a number
 * @param {number} n
 * @returns {number}
**/
function abs (n) {
    return n < 0 ? -n : n
}
/**
 * returns the truncated number
 * @param {number} n
 * @returns {number}
**/
function trunc (n) {
    return n | 0
}
/**
 * returns the floored number
 * @param {number} n
 * @returns {number}
**/
function floor (n) {
    return n < 0 ? (n | 0) - 1 : n | 0
}
/**
 * returns the ceilinged number
 * @param {number} n
 * @returns {number}
**/
function ceil (n) {
    return floor(n) + 1
}
/**
 * returns the rounded number
 * @param {number} n
 * @returns {number}
**/
function round (n) {
    return n - floor(n) < 0.5 ? floor(n) : ceil(n)
}
/** TODO **/
/**
 * returns the sine of an angle
 * alias for Math.sin
 * @param {number} ang - angle
 * @returns {number}
**/
function sin (ang) {
    if(skiJSData.angle === DEGREES) ang = degrees(ang)
    return Math.sin(ang)
}
/**
 * returns the cosine of an angle
 * alias for Math.cos
 * @param {number} ang - angle
 * @returns {number}
**/
function cos (ang) {
    if(skiJSData.angle === DEGREES) ang = degrees(ang)
    return Math.cos(ang)
}
/**
 * returns the tangent of an angle
 * alias for Math.tan
 * @param {number} ang - angle
 * @returns {number}
**/
function tan (ang) {
    if(skiJSData.angle === DEGREES) ang = degrees(ang)
    return Math.tan(ang)
}
/**
 * returns the arccosine of an angle
 * alias for Math.acos
 * @param {number} ang - angle
 * @returns {number}
**/
function acos (ang) {
    if(skiJSData.angle === DEGREES) ang = degrees(ang)
    return Math.acos(ang)
}
/**
 * returns the arcsine of an angle
 * alias for Math.asin
 * @param {number} ang - angle
 * @returns {number}
**/
function asin (ang) {
    if(skiJSData.angle === DEGREES) ang = degrees(ang)
    return Math.asin(ang)
}
/**
 * returns the arctangent of an angle
 * alias for Math.atan
 * @param {number} ang - angle
 * @returns {number}
**/
function atan (ang) {
    ang = Math.atan(ang)
    if(skiJSData.angle === DEGREES) ang = radians(ang)
    return ang
}
/**
 * alias for Math.atan2
 * @param {number} y
 * @param {number} x
 * @returns {number}
**/
function atan2 (y, x) {
    let ang = Math.atan2(y, x)
    if(skiJSData.angle === DEGREES) ang = radians(ang)
    return ang
}
/**
 * returns the radian value of an angle in degrees
 * @param {number} ang - angle
 * @returns {number}
**/
function radians (ang) {
    return ang * (180 / PI)
}
/**
 * returns the degrees of an angle in radians
 * @param {number} ang - angle
 * @returns {number}
**/
function degrees (ang) {
    return ang * (PI / 180)
}
/**
 * sets the angle mode
 * @param {string} mode - use DEGREES or RADIANS
**/
function angleMode (mode) {
    skiJSData.angle = mode
}
/**
 * evaluates the bezier at a point given t
 * @param {number} a - control x 1
 * @param {number} b - control y 1
 * @param {number} c - control x 2
 * @param {number} d - control y 2
 * @param {number} t - value between 0 an' 1
 * @returns {number}
**/
function bezierPoint (a, b, c, d, t) {
    return (1 - t) * (1 - t) * (1 - t) * a + 3 * (1 - t) * (1 - t) * t * b + 3 * (1 - t) * t * t * c + t * t * t * d
}
/**
 * evaluates the bezier at a tangent given t
 * @param {number} a - control x 1
 * @param {number} b - control y 1
 * @param {number} c - control x 2
 * @param {number} d - control y 2
 * @param {number} t - value between 0 an' 1
 * @returns {number}
**/
function bezierTangent (a, b, c, d, t) {
    return (3 * t * t * (-a + 3 * b - 3 * c + d) + 6 * t * (a - 2 * b + c) + 3 * (-a + b))
}
/**
 * sets the color mode
 * @param {string} mode - use RGBA or HEX or HSL
**/
function colorMode (mode) {
    return skiJSData.color = mode
}
/**
 * returns the color given a variety of arguments.
 * this is a monster function that handles a lot of cases.
 * @params {...*} args - see examples below
 * @example
 * color(25)
 * color([25])
 * //returns "rgba(25, 25, 25, 1)"
 * color(25, 100)
 * color([25, 100])
 * //returns "rgba(25, 25, 25, 0.3921...)" where 0.3921... = 100 / 255
 * color(175, 250, 175)
 * color([175, 250, 175])
 * //returns "rgba(175, 250, 175, 1)"
 * color(175, 250, 175, 100)
 * color([175, 250, 175, 100])
 * //returns "rgba(175, 250, 175, 0.3921...)" where 0.3921... = 100 / 255
 * colorMode(HSL)
 * color(147, 50, 47)
 * color([147, 50, 47])
 * color("hsl(147, 50%, 47%)")
 * //returns "hsl(147, 50%, 47%)"
 * colorMode(HEX)
 * color("#000")
 * //returns "#000"
 * color("rgba(25, 25, 25, 1)")
 * //returns "rgba(25, 25, 25, 1)"
**/
function color (...args) {
    if (typeof args[0] === "string" && args.length <= 1 && (/(#|rgb|hsl|rgba)/).test(args[0])) return args[0]
    args[0] instanceof Array && (args = args[0])
    if (typeof args[1] === "number" && (/rgb|rgba/).test(args[0])) {
        let cache = args[0].match(/[0-9\.]+(?=(,|\)))/g)
        args = [cache[0], cache[1], cache[2], args[1]]
    }
    switch (skiJSData.color) {
        case RGBA:
            const [r, g, b, a] = args.length > 4 ? Object.assign(args, {
                length: 4
            }) : args
            switch (args.length) {
                case 1:
                    return `rgba(${r}, ${r}, ${r}, 1)`
                    break
                case 2:
                    return `rgba(${r}, ${r}, ${r}, ${g / 255})`
                    break
                case 3:
                    return `rgba(${r}, ${g}, ${b}, 1)`
                    break
                case 4:
                    return `rgba(${r}, ${g}, ${b}, ${a / 255})`
            }
            break
        case HSL:
            return `hsl(${args[0]}, ${args[1]}%, ${args[2]}%)`
            break
        case HEX:
            return args[0]
    }
}
/**
 * uses `lerp` to linerally interpolate two rgba color values
 * @param {string} color1 - use `color`
 * @param {string} color2 - use `color`
 * @param {number} amt - amount to lerp
 * @returns {string} - the lerped color
**/
function lerpColor (color1, color2, amt) {
    if (typeof color1 !== "string" || typeof color2 !== "string" || skiJSData.color !== RGBA)
        return
    const [r1, g1, b1, a1] = color1.match(/\d{1,3}/g)
    const [r2, g2, b2, a2] = color2.match(/\d{1,3}/g)
    return `rgba(${lerp(+r1, +r2, amt)}, ${lerp(+g1, +g2, amt)}, ${lerp(+b1, +b2, amt)}, ${lerp(+a1, +a2, amt)})`
}
/**
 * returns a promise that resolves once an image has been fetched.
 * @params {string} src - image source
 * @params {number} [width] - width of the image
 * @params {number} [height] - height of the image
 * @returns {Promise}
**/
function getImage (src, width, height) {
    return new Promise((resolve, reject) => {
        let img = loadImage(src, width, height)
        //resolve or reject
        img.onload = () => resolve(img)
        img.onerror = () => reject("invalid or unaccessible image source")
    })
}
/**
 * returns an image
 * @params {string} src - image source
 * @params {number} [width] - width of the image
 * @params {number} [height] - height of the image
 * @returns {Image}
**/
function loadImage (src, width, height) {
    let img
    //dimensions
    if(width) img = new Image(width, height)
    else img = new Image
    //source
    img.src = src
    if(!(/khanacademy/).test(src)) img.crossOrigin = "anonymous"
    return img
}
/**
 * returns a promise that resolves once all fonts has been fetched.
 * @params {...string} fonts - all fonts
 * @returns {Promise}
 * @example
 * getFont("Roboto", "Comfortaa")
 * //fetches Roboto an' Comfortaa from Google Fonts
**/
function getFont (...fonts) {
    return new Promise ((res, rej) => {
        // xxx HS16 - Efficiency :P
        const link = loadFont(...fonts) 
        link.onload = () => res(link)
        link.onerror = () => reject("invalid or unaccessible fonts. not rlly, it's just an error lol. idk what went wrong, but you're router or DNS is blockin' fonts.googleapis.com")
    })
}
/**
 * returns an HTMLLinkElement that loads the fonts from Google Fonts
 * @params {...string} fonts - all fonts
 * @returns {HTMLLinkElement}
 * @example
 * loadFont("Roboto", "Comfortaa")
 * //fetches Roboto an' Comfortaa from Google Fonts
**/
function loadFont (...fonts) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `https://fonts.googleapis.com/css?family=${fonts.join("|").replace(/ /g, "+")}`
    document.body.appendChild(link)
    return link
}

// animation
/**
 * sets the frame rate
 * @params {number} rate - the frame rate in fps; note that 60 is the max due to JS restrictions
**/
function frameRate (rate) {
    skiJSData.rate = rate
}
/**
 * returns the milliseconds that have elapsed since the program started.
 * @returns {number}
**/
function millis () {
    return skiJSData.millis
}
frameCount = 0
delta = 1000 / 60
then = performance.now()
skiJSData.start = performance.now()
function raf (time) {
    requestAnimationFrame(raf)
    delta = time - then
    let ms = 1000 / skiJSData.rate
    if (delta < ms) return
    let overflow = delta % ms
    then = time - overflow
    delta -= overflow
    draw_standin(time)
    frameCount += 1
    skiJSData.millis = performance.now() - skiJSData.start
    fps = 1000 / delta
}

/**
 * due to the way the KA environment is set up, the `draw` function works a lil' funny.
 * this is all PT's work (shoutout to him). you came to the docs, so here's a quick
 * explanation of how it works in case you run into any problems.
 * first, a new property of `window` is defined, `draw`.
 * second, we attach it to a function called `draw_standin`
 * when you set `draw`, the `draw_standin` function is set an' `raf` is run.
 * there is an argument that you can call from draw, time which works much like
 * performance.now().
**/
Object.defineProperty(window, "draw", {
    get() {
        return draw_standin
    },
    set(func) {
        typeof draw_standin !== "function" && requestAnimationFrame(raf)
        draw_standin = func
    },
    configurable: true
})

// for the KA environment
for (let i = requestAnimationFrame(() => 0); i--;) cancelAnimationFrame(i)

//whew.