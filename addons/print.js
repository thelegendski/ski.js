var println = (...args) => {
    closer.style.display === "none" && [...logger.childNodes].forEach(child => child.classList.contains('line') && logger.removeChild(child))
    logger.style.animation = "0.3s forwards open"
    closer.style.display = "flex"
    args.forEach(arg => {
        const div = document.createElement('div')
        div.setHTML(arg.toString(), new Sanitizer({allowElements: ['a']}))
        div.setAttribute('class', 'line')
        div.setAttribute('display', 'flex')
        div.setAttribute('width', '100vw')
        logger.appendChild(div)
    })
    printData.print = true
},
clearLogs = () => {
    if(!printData.print) return
    logger.style.animation = "0.5s forwards close"
    closer.style.display = "none"
    printData.print = false
},
logger = document.createElement('div'),
closer = document.createElement('span'),
style  = document.createElement('style')
var printData = skiJSData ?? {}

style.innerHTML = `
@keyframes close {
    from {
        height: 20vh;
        overflow: auto;
        padding: 1vmin;
    }
    to {
        height: 0vh;
        overflow: hidden;
        padding: 0vmin;
    }
}
@keyframes open {
    from {
        height: 0vh;
        overflow: hidden;
        padding: 0vmin;
    }
    to {
        height: 20vh;
        overflow: auto;
        padding: 1vmin;
    }
}
@font-face {
    font-family: "println console";
    src: url(https://fonts.gstatic.com/s/nunito/v25/XRXI3I6Li01BKofiOc5wtlZ2di8HDFwmdTQ3jw.woff2) format('woff2');
}
.logger {
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 0vh;
    position: fixed;
    top: 0;
    left: 0;
    font-family: "println console";
    font-size: 3.5vmin;
    color: rgba(250, 250, 250);
    z-index: 1e3;
    box-sizing: border-box;
}
.close {
    position: fixed;
    top: 0;
    right: 0;
    margin: 1vmin;
    width: 6vmin;
    height: 6vmin;
    border-radius: 90px;
    border: 3px solid rgba(0, 0, 0, 0.25);
    background: rgba(0, 0, 0, 0.35);
    color: rgba(250, 250, 250, 0.75);
    cursor: pointer;
    z-index: 2e3;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 5vmin;
    user-select: none;
    transition: 0.5s;
    display: none;
}
.close:hover {
    background: rgba(200, 25, 0, 0.65);
    transition: 0.3s;
}
.close:active {
    background: rgba(200, 25, 0, 0.85);
    transition: 0.3s;
}
`
closer.setAttribute('class', 'close')
closer.setHTML('X')
logger.setAttribute('class', 'logger')
logger.onclick = e => e.target.classList.contains('close') && clearLogs()

document.head.appendChild(style)
logger.appendChild(closer)
document.body.appendChild(logger)

printData.print = false
