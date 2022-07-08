var canvas, ctx, width, height, draw, CORNER, CENTER, CLOSE, LEFT, RIGHT, UP, DOWN, SQUARE, ROUND, PROJECT, MITER, BEVEL, DEGREES, RADIANS, left, right, data, v, frameCount, frameRate, millis, debug, equal, day, month, year, hour, minute, seconds, enableContextMenu, smooth, cursor, angleMode, max, min, mag, dist, exp, norm, map, lerp, random, constrain, log, sqrt, sq, pow, abs, floor, ceil, round, sin, cos, tan, acos, asin, atan, atan2, radians, degrees, fill, stroke, background, color, noStroke, noFill, comp, rect, clear, text, rectMode, ellipseMode, createFont, textAlign, textFont, textSize, strokeCap, strokeJoin, strokeWeight, pushMatrix, popMatrix, translate, rotate, scale, beginShape, vertex, curveVertex, bezierVertex, endShape, curve, bezier, arc, ellipse, quad, triangle, point, line, textWidth, textAscent, textDescent, get, mask, image, mousePressed, mouseReleased, mouseScrolled, mouseClicked, mouseOver, mouseOut, mouseMoved, mouseIsPressed, mouseButton, mouseX, mouseY, pmouseX, pmouseY, keyPressed, keyReleased, keyTyped, key, keyIsPressed, keyCode, resetMatrix, clearLogs, println, clear, bezierPoint, bezierTangent, fps, lerpColor, size, cw, ch, cmin, cmax, Canvas
//library [
//some setup [
var logger = document.getElementsByClassName('print')[0]
canvas = document.getElementsByTagName('canvas')[0]
ctx = canvas.getContext('2d')
width = canvas.width = window.innerWidth
height = canvas.height = window.innerHeight
cw = width / 100
ch = height / 100
cmin = Math.min(cw, ch)
cmax = Math.max(cw, ch)
draw = ()=>{}
//]
//a bunch of constants [
CORNER = new Number(0)
CENTER = new Number(1)
CLOSE = new Boolean(true)
LEFT = new Number(37)
RIGHT = new Number(39)
UP = new Number(38)
DOWN = new Number(40)
SQUARE = new String('butt')
ROUND = new String('round')
PROJECT = new String('square')
MITER = new String('miter')
BEVEL = new String('bevel')
DEGREES = new String('deg')
RADIANS = new String('rad')
left = new Number(0)
right = new Number(2)
//]
//general data to be stored
data = {
	rect: 1,
	ellipse: 1,
	height: 12,
	angle: 'deg',
	date: Date.now(),
	rate: 60,
	millis: Date.now(),
	last: Date.now(),

}
//fps
fps = 60
//vector array
v = []
//animation [
frameCount = 0
frameRate = rate=>data.rate = rate
millis = ()=>data.millis
//]
//miscellaneous [
debug = function() {
	console.debug(...arguments)
}
equal = function() {
	console.assert(...arguments)
}
day = ()=>new Date().getDate()
month = ()=>new Date().getMonth()
year = ()=>new Date().getYear()
hour = ()=>new Date().getHours()
minute = ()=>new Date().getMinutes()
seconds = ()=>new Date().getSeconds()
enableContextMenu = ()=>canvas.oncontextmenu = true
cursor = name=>document.body.style.cursor = name
smooth = ()=>{
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'
}
angleMode = mode=>data.angle = mode
clearLogs = ()=>logger.innerHTML = '<button class = "close">close</button>'
println = function() {
	logger.style.display = "block"
	logger.innerHTML += `<div class = 'line'>
                    ${(msg=>{
		let string = ''
		msg.map(s=>string += `${s} `)
		return string.trim()
	}
	)(Array.from(arguments))}
                </div>`
}
size = (w, h) => {
	canvas.width = w
	canvas.style.width = `${w}px`
	canvas.height = h
	canvas.style.height = `${h}px`
}
//]
//math [
//complex[ish] math
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
//simple math
log = n=>Math.log(n)
sqrt = n=>Math.sqrt(n)
sq = n=>n ** 2
pow = (n,a)=>n ** a
abs = n=>n < 0 ? -n : n
floor = n=>n | 0
ceil = n=>(n | 0) + 1
round = n=>n - (n | 0) < 0.5 ? (n | 0) : (n | 0) + 1
//trig
sin = ang=>Math.sin(degrees(ang))
cos = ang=>Math.cos(degrees(ang))
tan = ang=>Math.tan(degrees(ang))
acos = ang=>Math.acos(degrees(ang))
asin = ang=>Math.asin(degrees(ang))
atan = ang=>Math.atan(degrees(ang))
radians = ang=>ang * (180 / Math.PI)
degrees = ang=>ang * (Math.PI / 180)
atan2 = (y,x)=>radians(Math.atan2(y, x))
bezierPoint = (a,b,c,d,t)=>(1 - t) * (1 - t) * (1 - t) * a + 3 * (1 - t) * (1 - t) * t * b + 3 * (1 - t) * t * t * c + t * t * t * d
bezierTangent = (a,b,c,d,t)=>(3 * t * t * (-a + 3 * b - 3 * c + d) + 6 * t * (a - 2 * b + c) + 3 * (-a + b))
//]
//colorin' [
fill = function(r, g, b, a) {
	switch (arguments.length) {
	case 1:
		ctx.fillStyle = typeof r === 'string' ? r : `rgb(${r}, ${r}, ${r}, 255)`
		break;
	case 2:
		ctx.fillStyle = `rgb(${r}, ${r}, ${r}, ${g / 255})`
		break;
	case 3:
		ctx.fillStyle = `rgb(${r}, ${g}, ${b}, 255)`
		break;
	case 4:
		ctx.fillStyle = `rgb(${r}, ${g}, ${b}, ${a / 255})`
	}
}
color = function(r, g, b, a) {
	switch (arguments.length) {
	case 1:
		return `rgba(${r}, ${r}, ${r}, 255)`
		break
	case 2:
		return `rgba(${r}, ${r}, ${r}, ${g / 255})`
		break
	case 3:
		return `rgba(${r}, ${g}, ${b}, 255)`
		break;
	case 4:
		return `rgba(${r}, ${g}, ${b}, ${a / 255})`
		break
	}
}
stroke = function(r, g, b, a) {
	switch (arguments.length) {
	case 1:
		ctx.strokeStyle = typeof r === 'string' ? r : `rgb(${r}, ${r}, ${r}, 255)`
		break;
	case 2:
		ctx.strokeStyle = `rgb(${r}, ${r}, ${r}, ${g / 255})`
		break;
	case 3:
		ctx.strokeStyle = `rgb(${r}, ${g}, ${b}, 255)`
		break;
	case 4:
		ctx.strokeStyle = `rgb(${r}, ${g}, ${b}, ${a / 255})`
	}
}
background = function(r, g, b, a) {
	let prev = [ctx.strokeStyle, ctx.fillStyle]
	switch (arguments.length) {
	case 1:
		document.body.style.background = ctx.fillStyle = typeof r === 'string' ? r : `rgb(${r}, ${r}, ${r}, 255)`
		break;
	case 2:
		document.body.style.background = ctx.fillStyle = `rgb(${r}, ${r}, ${r}, ${g / 255})`
		break;
	case 3:
		document.body.style.background = ctx.fillStyle = `rgb(${r}, ${g}, ${b}, 255)`
		break;
	case 4:
		document.body.style.background = ctx.fillStyle = `rgb(${r}, ${g}, ${b}, ${a / 255})`
	}
	noStroke()
	ctx.fillRect(0, 0, width, height)
	ctx.strokeStyle = prev[0]
	ctx.fillStyle = prev[1]
}
lerpColor = (c,C,a)=>{
	if (typeof C !== 'string' || typeof c !== 'string')
		return
	const [r,g,b,_a] = c.match(/\d{1,3}/g)
	const [R,G,B,A] = C.match(/\d{1,3}/g)
	return `rgba(${lerp(+r, +R, a)}, ${lerp(+g, +G, a)}, ${lerp(+b, +B, a)}, ${lerp(+_a, +A, a)})`
}
clear = ()=>{
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
}
noStroke = ()=>ctx.strokeStyle = 'rgb(0, 0, 0, 0)'
noFill = ()=>ctx.fillStyle = 'rgb(0, 0, 0, 0)'
//]
//shapes [
comp = (x,y,w,h,draw)=>data[draw] > 0 ? [x - w / 2, y - h / 2] : [x, y]
rect = (x,y,width,height,tl,tr,br,bl)=>{
	[x,y] = comp(x, y, width, height, 'rect')
	if (tl) {
		const w = width / 2
		  , h = height / 2
		tl = tl > w || tl > h ? Math.min(w, h) : tl
		tr = !bl ? tl : tr
		tr = tr > w || tr > h ? Math.min(w, h) : tr
		br = !bl ? tl : br
		br = br > w || br > h ? Math.min(w, h) : br
		bl = !bl ? tl : bl
		bl = bl > w || bl > h ? Math.min(w, h) : bl
		if (ctx.strokeStyle === 'rgba(0, 0, 0, 0)')
			ctx.translate(0.5, 0.5)
		beginShape()
		vertex(x + tl, y)
		vertex(x + width - tr, y)
		curveVertex(x + width, y, x + width, y + tr)
		vertex(x + width, y + height - br)
		curveVertex(x + width, y + height, x + width - br, y + height)
		vertex(x + bl, y + height)
		curveVertex(x, y + height, x, y + height - bl)
		vertex(x, y + tl)
		curveVertex(x, y, x + tl, y)
		endShape()
		if (ctx.strokeStyle === 'rgba(0, 0, 0, 0)')
			ctx.translate(-0.5, -0.5)
	} else {
		ctx.strokeRect(x, y, width, height)
		ctx.fillRect(x, y, width, height)
	}
}
clear = ()=>ctx.clearRect(0, 0, canvas.width, canvas.height)
text = (msg,x,y)=>{
	msg = Object.is(typeof msg, 'string') ? msg : msg.toString()
	if (msg.match('\n')) {
		msg.split('\n').map((p,i)=>{
			ctx.strokeText(p, x, y + ((i - ((msg.split('\n')).length - 1) / 2) * data.height))
			ctx.fillText(p, x, y + ((i - ((msg.split('\n')).length - 1) / 2) * data.height))
		}
		)
	} else {
		ctx.strokeText(msg, x, y)
		ctx.fillText(msg, x, y)
	}
}
rectMode = (m)=>data['rect'] = m
ellipseMode = (m)=>data['ellipse'] = m
textAlign = (x,y)=>{
	ctx.textAlign = x <= 0 ? 'start' : 'center'
	ctx.textBaseline = y <= 0 ? 'alphabetic' : 'middle'
}
createFont = (font)=>font
textSize = size=>{
	data.height = size
	ctx.font = `${size}px ${data.font}`
}
textFont = (font,size)=>{
	data.height = size
	data.font = font
	ctx.font = `${size}px ${font}`
}
strokeCap = mode=>ctx.lineCap = mode
strokeJoin = mode=>ctx.lineJoin = mode
strokeWeight = weight=>ctx.lineWidth = Number(weight)
pushMatrix = ()=>ctx.save()
popMatrix = ()=>ctx.restore()
resetMatrix = popMatrix
translate = (x,y)=>ctx.translate(x, y)
rotate = ang=>ctx.rotate(degrees(ang))
scale = (w,h)=>ctx.scale(w, h ? h : w)
beginShape = ()=>v = []
vertex = (x,y)=>v.push([x, y, 'v'])
curveVertex = (cx,cy,x,y)=>v.push([cx, cy, 'c', x, y])
bezierVertex = (cx,cy,cX,cY,x,y)=>v.push([cx, cy, 'b', cX, cY, x, y])
endShape = (end)=>{
	if (v.length < 2)
		return
	ctx.beginPath()
	for (let i = 0; i < v.length; i++) {
		let p = v[i]
		if (i <= 0) {
			if (p[2] !== ('v' || 'c'))
				return
			ctx.moveTo(p[0], p[1])
		} else {
			switch (p[2]) {
			case 'v':
				ctx.lineTo(p[0], p[1])
				break
			case 'c':
				ctx.quadraticCurveTo(p[0], p[1], p[3], p[4])
				break
			case 'b':
				ctx.bezierCurveTo(p[0], p[1], p[3], p[4], p[5], p[6])
			}
		}
	}
	if (end)
		ctx.closePath()
	ctx.stroke()
	ctx.fill()
}
curve = function(x, y, cx, cy, cX, cY, X, Y) {
	if (arguments.length !== 8)
		return
	beginShape()
	vertex(x, y)
	curveVertex(cx, cy, cX, cY)
	vertex(X, Y)
	endShape()
}
bezier = function(x, y, cx, cy, cX, cY, X, Y) {
	if (arguments.length !== 8)
		return
	beginShape()
	vertex(x, y)
	bezierVertex(cx, cy, cX, cY, X, Y)
	endShape()
}
arc = (x,y,w,h,start,stop,close)=>{
	[x,y] = comp(x, y, w, h, 'ellipse')
	ctx.save()
	ctx.translate(x + w / 2, y + h / 2)
	ctx.scale(1, h / w)
	ctx.beginPath()
	ctx.arc(0, 0, w / 2, degrees(start), degrees(stop))
	if (close)
		ctx.closePath()
	ctx.restore()
	ctx.fill()
	ctx.stroke()
}
ellipse = (x,y,w,h)=>{
	if (Object.is(data.ellipse, CORNER)) {
		x += w / 2
		y += h / 2
	}
	ctx.beginPath()
	ctx.arc(x, y, w / 2, h / 2, -1, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}
quad = (x,y,X,Y,_x,_y,_X,_Y)=>{
	beginShape()
	vertex(x, y)
	vertex(X, Y)
	vertex(_x, _y)
	vertex(_X, _Y)
	endShape(CLOSE)
}
triangle = (x,y,X,Y,_x,_y)=>{
	beginShape()
	vertex(x, y)
	vertex(X, Y)
	vertex(_x, _y)
	endShape(CLOSE)
}
point = (x,y)=>{
	if (!Object.is(ctx.strokeStyle, 'rgba(0, 0, 0, 0)')) {
		let style = ctx.strokeStyle
		noStroke()
		ellipse(x, y, ctx.lineWidth, ctx.lineWidth)
		ctx.strokeStyle = style
	} else {
		return
	}
}
line = (x,y,X,Y)=>{
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.lineTo(X, Y)
	ctx.closePath()
	ctx.stroke()
}
textWidth = (txt)=>{
	let width = 0
	txt.split('\n').map(str=>width = max(width, ctx.measureText(txt).width))
	return width
}
textAscent = ()=>ctx.measureText('a').fontBoundingBoxAscent
textDescent = ()=>ctx.measureText('a').fontBoundingBoxDescent
Canvas = (w,h)=>{
	const C = Object.assign(document.createElement('canvas'), {
		width: w,
		height: h
	})
	return [C, C.getContext('2d')]
}
get = function(x, y, w, h, src) {
	let canv, data, context, Canv
	switch (arguments.length) {
	case 0:
		get(0, 0, width, height)
		break
	case 2:
		data = ctx.getImageData(x, y, 1, 1).data
		return color(data[0], data[1], data[2], data[3])
		break
	case 3:
		Canv = Canvas(w.width, w.height)
		context = Canv[1]
		if (w instanceof HTMLImageElement) {
			context.drawImage(w, 0, 0)
			data = context.getImageData(x, y, 1, 1)
		} else {
			data = w.getContext('2d').getImageData(x, y, 1, 1).data
		}
		return color(data[0], data[1], data[2], data[3])
		break
	case 4:
		Canv = Canvas(w, h)
		canv = Canv[0]
		context = Canv[1]
		context.putImageData(ctx.getImageData(x, y, w, h), 0, 0)
		return canv
		break
	case 5:
		Canv = Canvas(src.width, src.height)
		context = Canv[1]
		context.drawImage(src, -x, -y)
		return Canv[0]
		break
	default:
		return
	}
}
mask = ()=>ctx.clip()
image = (img,x,y,w,h)=>{
	ctx.drawImage(img, x, y, w || img.width, h || img.height)
}
//]
//interaction [
//mouse [
mousePressed = ()=>{}
mouseReleased = ()=>{}
mouseScrolled = ()=>{}
mouseClicked = ()=>{}
mouseOut = ()=>{}
mouseOver = ()=>{}
mouseMoved = ()=>{}
mouseIsPressed = false
mouseButton = left
mouseX = 0
mouseY = 0
pmouseX = mouseX
pmouseY = mouseY
canvas.onmousedown = e=>{
	mousePressed(e)
	mouseIsPressed = true
	mouseButton = e.button
}
canvas.onmousemove = e=>{
	pmouseX = mouseX
	pmouseY = mouseY
	mouseX = e.pageX
	mouseY = e.pageY
	mouseMoved(e)
}
canvas.onmouseup = e=>{
	mouseReleased(e)
	mouseClicked(e)
	mouseButton = e.button
	mouseIsPressed = false
	e.preventDefault()
}
canvas.oncontextmenu = e=>e.preventDefault()
canvas.onmouseover = e=>{
	e.preventDefault()
	mouseOver(e)
}
canvas.onmouseout = e=>{
	e.preventDefault()
	mouseOut(e)
}
canvas.onwheel = e=>{
	e.preventDefault()
	mouseScrolled(e)
}
//]
//keys [
keyPressed = function() {}
keyReleased = function() {}
keyTyped = function() {}
document.onkeydown = e=>{
	if (e.key !== 'F11' && !e.ctrlKey && !e.key === 'Control')
		e.preventDefault()
	key = e.key
	keyCode = e.keyCode
	keyIsPressed = true
	keyPressed(e)
}
document.onkeyup = e=>{
	if (e.key !== 'F11' && !e.ctrlKey && !e.key === 'Control')
		e.preventDefault()
	key = e.key
	keyCode = e.keyCode
	keyReleased(e)
}
document.onkeypress = e=>{
	if (e.key !== 'F11' && !e.ctrlKey && !e.key === 'Control')
		e.preventDefault()
	key = e.key
	keyCode = e.keyCode
	keyTyped(e)
}
//]
//]
var loopy
window.init = true
//]
//print logic [
var print = document.getElementsByClassName('print')[0]
print.onclick = e=>{
	if (e.path[0].classList.contains('close')) {
		clearLogs()
		print.style.display = 'none'
	}
}
//]
}
if (loopy)
	window.clearInterval(loopy)
loopy = window.setInterval(()=>{
	draw()
	frameCount += 1
	fps = frameCount % 20 <= 0 ? 1000 / (Date.now() - data.date) : fps
	data.date = Date.now()
	data.millis = Date.now() - data.last
	if (fps <= 10)
		canvas.click()
}
, 1000 / data.rate)
