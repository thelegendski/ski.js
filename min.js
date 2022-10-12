/*
  ski.js
  version 1.6.0
  
  minified to work without canvas
*/

//all variables at global scope
var data, frameCount, frameRate, millis, debug, equal, day, month, year, hour, minute, seconds, cursor, angleMode, max, min, mag, dist, exp, norm, map, lerp, random, constrain, log, sqrt, sq, pow, abs, floor, ceil, round, sin, cos, tan, acos, asin, atan, atan2, radians, degrees, bezierPoint, bezierTangent, fps, noLoop, raf, delta, then, draw_standin

//create constants
DEGREES = 'degrees'
RADIANS = 'radians'

//data used by ski.js
data = {
	rate: 60,
	millis: 0,
	start: 0,
  angle: 'degrees'
}

//fps
fps = 60

//miscellaneous
debug = (...args) => console.debug(...args)
equal = (...args) => console.assert(...args)
day = ()=>(new Date).getDate()
month = ()=>(new Date).getMonth()
year = ()=>(new Date).getYear()
hour = ()=>(new Date).getHours()
minute = ()=>(new Date).getMinutes()
seconds = ()=>(new Date).getSeconds()
cursor = name=>document.body.style.cursor = name
angleMode = mode=>data.angle = mode
noLoop = ()=>draw = 0

//math
max = (n,N)=>n < N ? N : n
min = (n,N)=>n < N ? n : N
mag = (a,b)=>Math.sqrt((a ** 2) + (b ** 2))
dist = (x,y,X,Y)=>mag(x - X, y - Y)
exp = n=>Math.E ** n
norm = (val,low,high)=>(val - low) / (high - low)
map = (val,s,e,S,E)=>S + (E - S) * norm(val, s, e)
lerp = (val,targ,amt)=>((targ - val) * amt) + val
random = (min,max)=>max ? (Math.random() * (max - min)) + min : min ? (Math.random() * min) : Math.random()
constrain = (val,low,high)=>min(max(val, low), high)
log = n=>Math.log(n)
sqrt = n=>Math.sqrt(n)
sq = n=>n ** 2
pow = (n,a)=>n ** a
abs = n=>n < 0 ? -n : n
floor = n=>n | 0
ceil = n=>(n | 0) + 1
round = n=>n - (n | 0) < 0.5 ? (n | 0) : (n | 0) + 1
sin = ang=>Math.sin(data.angle === 'degrees' ? degrees(ang) : ang)
cos = ang=>Math.cos(data.angle === 'degrees' ? degrees(ang) : ang)
tan = ang=>Math.tan(data.angle === 'degrees' ? degrees(ang) : ang)
acos = ang=>Math.acos(data.angle === 'degrees' ? degrees(ang) : ang)
asin = ang=>Math.asin(data.angle === 'degrees' ? degrees(ang) : ang)
atan = ang=>Math.atan(data.angle === 'degrees' ? degrees(ang) : ang)
radians = ang=>ang * (180 / Math.PI)
degrees = ang=>ang * (Math.PI / 180)
atan2 = (y,x)=>radians(Math.atan2(y, x))
bezierPoint = (a,b,c,d,t)=>(1 - t) * (1 - t) * (1 - t) * a + 3 * (1 - t) * (1 - t) * t * b + 3 * (1 - t) * t * t * c + t * t * t * d
bezierTangent = (a,b,c,d,t)=>(3 * t * t * (-a + 3 * b - 3 * c + d) + 6 * t * (a - 2 * b + c) + 3 * (-a + b))

//animation
frameCount = 0
frameRate = rate=>data.rate = rate
millis = ()=>data.millis
delta = 1000 / 60
then = performance.now()
data.start = performance.now()
raf = time=>{
	requestAnimationFrame(raf)
	delta = time - then
	var ms = 1000 / data.rate
	if (delta < ms)
		return
	var overflow = delta % ms
	then = time - overflow
	delta -= overflow
	draw_standin(time)
	frameCount += 1
	data.millis = performance.now() - data.start
	fps = 1000 / delta
}
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

//for the KA environment
for (var i = requestAnimationFrame(()=>0); i--; )
	cancelAnimationFrame(i)

//easter egg?
