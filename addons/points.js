class Points {
    constructor(arr){
        this.points = arr
    }
    translate (x, y) {
        for(let i = this.points.length; i--;){
            let point = this.points[i]
            point.x += x
            point.y += y
        }
    }
    rotate (ang, center = {x: 0, y: 0}) {
        ang *= -1
        for(let i = this.points.length; i--;){
            let point = this.points[i]
            let distance = dist(center.x, center.y, point.x, point.y), angle = atan2(point.y - center.y, point.x - center.x)
            point.x = cos(angle + ang) * distance + center.x
            point.y = sin(angle + ang) * distance + center.y
        }
    }
    reflect (axis, val=0) {
        for(let i = this.points.length; i--;){
            let point = this.points[i]
            val && (point[axis] -= val)
            point[axis] *= -1
            val && (point[axis] += val)
        }
    }
    scale (factor, center=0) {
        if(!center){
            center = {x: 0, y: 0}
            this.points.forEach(p => {
                center.x += p.x
                center.y += p.y
            })
            center.x /= this.points.length
            center.y /= this.points.length
        }
        for(let i = this.points.length; i--;){
            let point = this.points[i]
            let ang = atan2(point.y - center.y, point.x - center.x), distance = dist(point.x, point.y, center.x, center.y)
            point.x = center.x + cos(ang) * distance * factor
            point.y = center.y + sin(ang) * distance * factor
        }
    }
    line (m, b) {
        for(let i = this.points.length; i--;){
            let point = this.points[i]
            let n = m / -1, a = point.y - n * point.x, x = (a - b) / (m - n), y = m * x + b
            let ang = atan2(point.y - y, point.x - x), distance = dist(point.x, point.y, x, y)
            point.x = x - cos(ang) * distance
            point.y = y - sin(ang) * distance
        }
    }
    print () {
        let str = ''
        this.points.forEach(p => {
            p.x = p.x.toFixed(4)
            p.y = p.y.toFixed(4)
            str += p.toString()
        })
        println(str)
    }
}
