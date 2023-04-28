//collision.js has a dependency of main.js
/**
 * the collision object
 * @namespace
**/
var collision = {
    /**
     * returns the euclidean distance of two coordinates squared
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {number} - the distance
    **/
    dist (x1, y1, x2, y2) {
      return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
    },
	rectCircle: {
	    /**
	     * returns whether a circle and a rectangle are colliding
         * @param {{x: number, y: number, size: number}} circle
         * @param {{x: number, y: number, width: number, height: number}} rectangle
         * @param {number} [size=circle.size] - size of the circle for collisions
         * @returns {boolean}
	    **/
        collide (circle, rect, size = circle.size) {
            let x, y
            rect.width = rect.width ?? rect.w
            rect.height = rect.height ?? rect.h
            size = circle.size ?? circle.s ?? circle.radius ?? circle.r ?? circle.diameter / 2 ?? circle.d / 2
            if(skiJSData.rect){
                x = constrain(circle.x, rect.x - rect.width / 2, rect.x + rect.width / 2)
                y = constrain(circle.y, rect.y - rect.height / 2, rect.y + rect.height / 2)
            }
            else {
                x = constrain(circle.x, min(rect.x, rect.x + rect.width), max(rect.x, rect.x + rect.width))
                y = constrain(circle.y, min(rect.y, rect.y + rect.height), max(rect.y, rect.y + rect.height))
            }
            return collision.dist(circle.x, circle.y, x, y) <= sq(size)
        },
        /**
         * returns the resolution position of a circle when in collision with a rectangle
         * @param {{x: number, y: number, size: number}} circle
         * @param {{x: number, y: number, width: number, height: number}} rectangle
         * @param {number} [size=circle.size] - size of the circle for collisions
         * @returns {{x: number, y: number}}
        **/
        physics (circle, rect, size = circle.size) {
            let x, y
            rect.width = rect.width ?? rect.w
            rect.height = rect.height ?? rect.h
            size = circle.size ?? circle.s ?? circle.radius ?? circle.r ?? circle.diameter / 2 ?? circle.d / 2
            size /= 2
            if(skiJSData.rect === CENTER){
                x = constrain(circle.x, rect.x - rect.width / 2, rect.x + rect.width / 2)
                y = constrain(circle.y, rect.y - rect.height / 2, rect.y + rect.height / 2)
            }
            else {
                x = constrain(circle.x, min(rect.x, rect.x + rect.width), max(rect.x, rect.x + rect.width))
                y = constrain(circle.y, min(rect.y, rect.y + rect.height), max(rect.y, rect.y + rect.height))
            }
            if(collision.dist(circle.x, circle.y, x, y) <= sq(size)){
                const ang = atan2(circle.x - x, circle.y - y)
                return {x: x + sin(ang) * size, y: y + cos(ang) * size}
            }
        },
	},
    circleCircle: {
        /**
	     * returns whether a circle and a circle are colliding
         * @param {{x: number, y: number, size: number}} circle1
         * @param {{x: number, y: number, size: number}} circle2
         * @param {number} [size=circle.size] - avg. size of the circle for collisions
         * @returns {boolean}
	    **/
        collide (circle1, circle2, size) {
            size = circle1.size ?? circle1.s ?? circle1.radius ?? circle1.r ?? circle1.diameter / 2 ?? circle2.d / 2 + circle2.size ?? circle2.s ?? circle2.radius ?? circle2.r ?? circle2.diameter / 2 ?? circle2.d / 2
            return collision.dist(circle1.x, circle1.y, circle2.x, circle2.y) <= sq(size)
        },
        /**
         * returns the resolution position of a circle when in collision with a circle
         * @param {{x: number, y: number, size: number}} circle
         * @param {{x: number, y: number, size: number}} rectangle
         * @param {number} [size=circle.size] - avg. size of the circle for collisions
         * @returns {{x: number, y: number}}
        **/
        physics (circle1, circle2, size) {
            size = circle1.size ?? circle1.s ?? circle1.radius ?? circle1.r ?? circle1.diameter / 2 ?? circle2.d / 2 + circle2.size ?? circle2.s ?? circle2.radius ?? circle2.r ?? circle2.diameter / 2 ?? circle2.d / 2
            if(collision.dist(circle1.x, circle1.y, circle2.x, circle2.y) <= sq(size)){
                const ang = atan2(circle1.y - circle2.y, circle1.x - circle2.x)
                return {x: circle2.x + cos(ang) * size, y: circle2.y + sin(ang) * size}
            }
        },
    },
    lineLine: {
        /**
         * @ignore
        **/
        on (a, b, c) {
            return b.x <= max(a.x, c.x) && b.x >= min(a.x, c.x) && b.y <= max(a.y, c.y) && b.y >= min(a.y, c.y)
        },
        /**
         * @ignore
        **/
        rot (a, b, c) {
            const val = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x) 
            return val > 0 ? 1 : val >= 0 ? 0 : 2
        },
        /**
         * returns true if two lines are colliding
         * @param {{x: number, y: number}} a - first endpoint on the first line
         * @param {{x: number, y: number}} b - second endpoint on the first line
         * @param {{x: number, y: number}} c - first endpoint on the second line
         * @param {{x: number, y: number}} d - second endpoint on the second line
         * @returns {boolean}
        **/
        collide (a, b, c, d) {
            const rot = this.rot, on = this.on
            const arr = [rot(a, b, c), rot(a, b, d), rot(c, d, a), rot(c, d, b)]
            return (arr[0] !== arr[1] && arr[2] !== arr[3]) || (arr[0] === 0 && on(a, c, b)) || (arr[1] === 0 && on(a, d, b)) || (arr[2] === 0 && on(c, a, d)) || (arr[3] === 0 && on(c, b, d))
        },
        /**
         * returns the intersection point of two lines if they are intersecting
         * @param {{x: number, y: number}} a - first endpoint on the first line
         * @param {{x: number, y: number}} b - second endpoint on the first line
         * @param {{x: number, y: number}} c - first endpoint on the second line
         * @param {{x: number, y: number}} d - second endpoint on the second line
         * @returns {{x: number, y: number}} - the intersection point
        **/
        intersect (a, b, c, d) {
            if(!this.collide(a, b, c, d)) return
            const val = (((b.x - a.x) * (a.y - c.y)) + ((b.y - a.y) * c.x) - ((b.y - a.y) * a.x)) / (((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x)))
            return {x: c.x + (d.x - c.x) * val, y: c.y + (d.y - c.y) * val}
        },
        /**
         * given a target position, finds the closest point on a line
         * @param {{x: number, y: number}} target
         * @param {{x: number, y: number}} point1 - first endpoint on the line
         * @param {{x: number, y: number}} point2 - second endpoint on the line
         * @returns {{x: number, y: number}} - closest point
        **/
        closest (target, point1, point2) {
            const d = {x: target.x - point1.x, y: target.y - point1.y}
            const e = {x: point2.x - point1.x, y: point2.y - point1.y}
            const s = constrain((d.x * e.x + d.y * e.y) / (e.x * e.x + e.y * e.y), 0, 1)
            return {x: point1.x + (e.x * s), y: point1.y + (e.y * s)}
        }
    },
    circleLine: {
        /**
         * returns true if a circle is colliding with a line
         * @param {{x: number, y: number, size: number}} circle
         * @param {{x: number, y: number}} point1 - first endpoint on the line
         * @param {{x: number, y: number}} point2 - second endpoint on the line
         * @param {number} [thickness=1] - the thickness of the line; stroke weight
         * @returns {boolean}
        **/
        collide (circle, point1, point2, thickness = 1) {
            const size = circle.size ?? circle.s ?? circle.radius ?? circle.r ?? circle.diameter / 2 ?? circle.d / 2
            const closest = collision.lineLine.closest(circle, point1, point2)
            const c = {x: circle.x - closest.x, y: circle.y - closest.y}
            const distance = sqrt(c.x * c.x + c.y * c.y)
            const o = distance - thickness - size / 2
            
            if(o <= 0) return true
            else return false
        },
        /**
         * returns the resolved position of a circle if the circle is colliding with a line
         * @param {{x: number, y: number, size: number}} circle
         * @param {{x: number, y: number}} point1 - first endpoint on the line
         * @param {{x: number, y: number}} point2 - second endpoint on the line
         * @param {number} [thickness=1] - the thickness of the line; stroke weight
         * @returns {{x: number, y: number}} - the resolution coordinates
        **/
        physics (circle, point1, point2, thickness = 1) {
            const size = circle.size ?? circle.s ?? circle.radius ?? circle.r ?? circle.diameter / 2 ?? circle.d / 2
            const closest = collision.lineLine.closest(circle, point1, point2)
            const c = {x: circle.x - closest.x, y: circle.y - closest.y}
            const distance = sqrt(c.x * c.x + c.y * c.y)
            const o = distance - thickness - size / 2
            
            c.x /= distance
            c.y /= distance
            
            if(o <= 0){
                return {x: circle.x - c.x * o, y: circle.y - c.y * o}
            }
        }
    },
}
Object.freeze(collision)
window.collision = collision
