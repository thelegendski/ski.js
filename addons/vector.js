//vector.js has a dependency of main.js
/**
 * creates a new 2D or 3D vector
 * @class
**/
class Vector {
    /**
     * @constructor
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [z=0]
    **/
    constructor (x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
    /**
     * returns a new vector with the same (x, y, z) values
     * @returns {Vector} - copied vector
    **/
    get () {
        return new Vector(this.x, this.y, this.z)
    }
    /**
     * sets the value of a vector
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @see {@link Vector.from} for parameters
    **/
    set (v, y, z) {
        Object.assign(this, Vector.from(v, y, z))
    }
    /**
     * returns the magnitude of the vector
     * @returns {number} - the magnitude
    **/
    mag () {
        return sqrt(sq(this.x) + sq(this.y) + sq(this.z))
    }
    /**
     * returns the squared magnitude of the vector
     * @returns {number} - the squared magnitude
    **/
    magSq () {
        return sq(this.x) + sq(this.y) + sq(this.z)
    }
    /**
     * sets the magnitude of the vector
     * @param {(number|Vector)} vec - length or vector
     * @param {number} [len] - length
     * @returns {Vector} - only if len is defined
    **/
    setMag (vec, len) {
        if(len){
            vec.normalize()
            vec.mult(len)
            return vec
        }
        else {
            this.normalize()
            this.mult(len)
        }
    }
    /**
     * adds two vectors together
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @see {@link Vector.from} for parameters
    **/
    add (v, y, z) {
        let vec = Vector.from(v, y, z)
        this.x += vec.x
        this.y += vec.y
        this.z += vec.z
    }
    /**
     * subtracts one vector from another
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @see {@link Vector.from} for parameters
    **/
    sub (v, y, z) {
        let vec = Vector.from(v, y, z)
        this.x -= vec.x
        this.y -= vec.y
        this.z -= vec.z
    }
    /**
     * multiply two vectors together
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @see {@link Vector.from} for parameters
    **/
    mult (v, y, z) {
        let vec = Vector.from(x, y, z)
        this.x *= vec.x
        this.y *= vec.y
        this.z *= vec.z
    }
    /**
     * divide one vector from another
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @see {@link Vector.from} for parameters
    **/
    div (x, y, z) {
        let vec = Vector.from(x, y, z)
        this.x /= vec.x
        this.y /= vec.y
        this.z /= vec.z
    }
    /**
     * rotates a vector a certain angle
     * for 2D vectors only
     * @param {number} ang - angle
    **/
    rotate (ang) {
        if(skiJSData.angle === DEGREES) ang = degrees(ang)
        this.x = cos(ang) * this.x - sin(ang) * this.y
        this.y = sin(ang) * this.x + cos(ang) * this.y
    }
    /**
     * gets the distance between two vectors
     * @param {Vector} vec - vector
     * @returns {number} - the distance
    **/
    dist (vec) {
        return sqrt(sq(this.x - vec.x) + sq(this.y - vec.y) + sq(this.z - vec.z))
    }
    /**
     * get the dot product of two vectors
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @see {@link Vector.from} for parameters
     * @returns {number} - the dot product
    **/
    dot (v, y, z) {
        let vec = Vector.from(v, y, z)
        return this.x * vec.x + this.y * vec.y + this.z * vec.z
    }
    /**
     * get the cross product of two vectors
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @see {@link Vector.from} for parameters
     * @returns {Vector} - the cross product
    **/
    cross (v, y, z) {
        let vec = Vector.from(v, y, z)
        let x = this.x
        y = this.y
        z = this.z
        let vx = vec.x, vy = vec.y, vz = vec.z
        return new Vector(
            y * vz - vy * z, 
            z * vx - vz * x,
            x * vy - vx * y
        )
    }
    /**
     * xxx HS16
     * Projects the current vector onto another
     * 
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector} The projected vector
     */
    project (v, y, z) {
        let vec = Vector.from(v, y, z);
        let ax = this.x, ay = this.y, az = this.z,
            bx = vec.x , by = vec.z , bz = vec.z;
        
        let t = (ax * bx + ay * by + az * bz) / (bx * bx + by * by + bz * bz);

        return new Vector(
            bx * t, by * t, bz * t
        );
    }
    /**
     * lerps a vector toward another
     * @param {(number|Vector|Array|{x: number, y: number})} [v]
     * @param {number} [y]
     * @param {number} [z]
     * @see {@link Vector.from} for parameters
    **/
    lerp (v, y, z, amt) {
        let vec = typeof v === "object" ? Vector.from(v) : Vector.from(v, y, z)
        amt = amt ?? y
        this.x = lerp(this.x, vec.x, amt)
        this.y = lerp(this.y, vec.y, amt)
        this.z = lerp(this.z, vec.z, amt)
    }
    /**
     * normalizes a vector to length 1
    **/
    normalize () {
        const mag = this.mag()
        if(mag > 0) this.div(mag)
    }
    /**
     * limit the length of a vector
     * @param {number} len - length
    **/
    limit (len) {
        if(this.mag() > len){
            this.normalize()
            this.mult(len)
        }
    }
    /**
     * returns the angle of the vector
     * only for 2D vectors
     * @returns {number} - angle
    **/
    heading () {
        return atan2(-this.y, this.x)
    }
    /**
     * returns the object form of the vector
     * @returns {{x: number, y: number, z: number}} - the object
    **/
    object () {
        return {x: this.x, y: this.y, z: this.z}
    }
    /**
     * returns the array form of the vector
     * @returns {number[]} - the array
    **/
    array () {
        return [this.x, this.y, this.z]
    }
    /**
     * returns the string form of the vector
     * @returns {string} - the string of the vector coordinates
    **/
    toString () {
        return `<${this.x}, ${this.y}, ${this.z}>`
    }
    /**
     * takes any range of values an' makes 'em a vector.
     * aka magic.
     * @param {(number|Vector|Array|{x: number, y: number})} [v] - if y, Vector, object, or array of values representing the vector; else, x coordinate.
     * @param {number} [y]
     * @param {number} [z=0]
     * @returns {Vector}
    **/
    static from (v, y, z = 0) {
        if(v instanceof Vector){
            return new Vector(v.x, v.y, v.z)
        }
        else if(v instanceof Array){
            return new Vector(v[0], v[1], v[2])
        }
        else {
            return new Vector(v, y, z)
        }
    }
    /**
     * creates a vector from an angle
     * @param {number} ang - angle
     * @param {Vector} [vec=new Vector] - vector
     * @returns {Vector} - the vector
    **/
    static fromAngle(ang, vec = new Vector){
        if(skiJSData.angle === DEGREES) ang = degrees(ang)
        vec.x = cos(ang)
        vec.y = sin(ang)
        return vec
    }
    /**
     * creates a random 2D vector
     * @param {Vector} [vec=new Vector] - vector
     * @returns {Vector} - the vector
    **/
    static random2D (vec = new Vector) {
        if(skiJSData.angle === DEGREES){
            return Vector.fromAngle(random(360), vec)
        }
        else {
            return Vector.fromAngle(random(TAU), vec)
        }
    }
    /**
     * creates a random 3D vector
     * @param {Vector} [vec=new Vector] - vector
     * @returns {Vector} - the vector
    **/
    static random3D (vec = new Vector) {
        let ang
        if(skiJSData.angle === DEGREES) ang = random(360)
        else ang = random(TAU)
        
        let z = random(2) - 1
        let mag = sqrt(1 - sq(vz))
        let x = cos(ang) * mag
        let y = sin(ang) * mag
        vec.set(x, y, z)
        return vec
    }
    /**
     * returns the angle between two vectors
     * @param {Vector} vec1
     * @param {Vector} vec2
     * @returns {number} - angle
    **/
    static angleBetween (vec1, vec2) {
        return acos(vec1.dot(vec2) / (vec1.mag() * vec2.mag()))
    }
}
