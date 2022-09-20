/*
print.js
version 1.0.0

code is meant to be used with the ski.js library
all code is made available and to be used under the MIT license. see here: http://opensource.org/licenses/mit-license.php
intended for use in the Khan Academy environment. use outside of an educational environment is not intended.
closely modeled after Processing.js/p5.js. no code, unless noted, has been taken from either.
*/
var println, clearLogs
document.head.appendChild(
    Object.assign(
        document.createElement('link'), {
            rel: 'stylesheet', 
            href: 'https://fonts.googleapis.com/css?family=Varela+Round|Josefin+Sans'
        }
    )
)
var style = document.createElement('style')
style.innerHTML = `
@keyframes close {
    from {
        height: 20vh;
    }
    to {
        height: 0vh;
    }
}
@keyframes open {
    from {
        height: 0vh;
    }
    to {
        height: 20vh;
    }
}
.print[name='ski']{
	display: none;
	position: fixed;
	top: 0;
	background: rgb(0, 0, 0, 0.5);
	z-index: 1e3;
	width: 100vw;
	height: 0vh;
	resize: vertical;
	color: rgb(245, 245, 245, 0.5);
	overflow-x: hidden;
	overflow-y: auto;
	font-size: 4vmin;
	font-family: "Josefin Sans";
	user-select: text;
}
.close[name='ski']{
	position: absolute;
	top: 0;
	right: 0;
	margin-top: 1vh;
	margin-right: 1vw;
	width: 6vmin;
	height: 6vmin;
	background: rgb(245, 245, 245, 0.35);
	border: 0.5vmin solid rgb(245, 245, 245, 0.5);
	border-radius: 90px;
	padding-left: 1vw;
	padding-top: 0.765vh;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	font-size: 4vmin;
	color: rgb(245, 245, 245, 0.5);
	z-index: 1e3;
	transition: 0.5s;
	font-family: 'Varela Round';
	user-select: none;
}
.close[name='ski']:hover {
	background: rgb(245, 100, 100, 0.625);
	transition: 0.3s;
}
.close[name='ski']:active {
	background: rgb(245, 100, 100, 0.75);
	transition: 0.3s;
}
.line[name='ski']{
	margin: 1vmin;
	z-index: 1e3;
}`
document.head.appendChild(style)
var logger = document.createElement('div')
logger.setAttribute('class', 'print')
logger.setAttribute('name', 'ski')
logger.onclick = event => event.path[0].classList.contains('close')) && void (clearLogs(), (logger.style.animation = '0.3s close forwards'))
var close = document.createElement('button')
close.setAttribute('class', 'close')
close.setAttribute('name', 'ski')
close.innerText = 'X'
logger.appendChild(close)
document.body.appendChild(logger)
clearLogs = ()=> {
    document.querySelectorAll('.line[name="ski"]').forEach(c => logger.removeChild(c))
    logger.style.overflowY = 'hidden'
    close.innerText = 'X'
}
println = (...args) => {
    logger.style.height === '' && (logger.style.animation = '0.5s open forwards', logger.style.overflowY = 'auto', logger.style.display = "block")
	logger.innerHTML += `
	<div class = 'line' name = 'ski'>
        ${
			(
				msg=>{
					let string = ''
					msg.map(s=>string += `${s} `)
					return string.trim()
				}
			)(Array.from(args))
		}
    </div>`
}
