/*
    ski.js
    version 1.9.0
*/

var SPACE, LEFT, RIGHT, UP, DOWN, PI, TAU,LEFT_BUTTON, RIGHT_BUTTON, ESCAPE, TAB, SHIFT, CONTROL, ALT, ENTER, BACKSPACE, RGBA, HSL, HEX, skiJSData

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
DEGREES = "deg"
RADIANS = "rad"
PI = Math.PI
TAU = PI * 2
RGBA = "rgba"
HSL = "hsl"
HEX = "hex"

// data used by ski.js
skiJSData = {
    angle: DEGREES,
    color: RGBA,
    rate: 60,
    millis: 0,
    start: 0,
    draw: 0,
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
    return mag(x - X, y - Y)
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
