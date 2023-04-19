export default class {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z
	}
	set(v, y = false, z) {
		!y ? this.set(
			v.x ?? v[0] ?? 0,
			v.y ?? v[1] ?? 0,
			v.z ?? v[2] ?? 0
		) : (
			this.x = v ?? 0,
			this.y = y ?? 0,
			this.z = z ?? 0
		)
	}
	get() {
		return new vec(this.x, this.y, this.z)
	}
	mag() {
		const S = Math.sqrt
		return S(this.x ** 2 + this.y ** 2 + this.z ** 2)
	}
	magSq() {
		return (this.x ** 2 + this.y ** 2 + this.z ** 2)
	}
	setMag(v, len = false) {
		if(!len) {
			this.normalize()
			this.mult(v)
		} else {
			v.normalize()
			v.mult(len)
			return v
		}
	}
	add(v, y = false, z) {
		[this.x, this.y, this.z] = !y ? [this.x + v.x, this.y + v.y, this.z + v.z] : [this.x + v, this.y + y, this.z + z]
	}
	sub(v, y = false, z) {
		!y ? this.add(-v) : this.add(-v, -y, -z)
	}
	mult(v) {
		[this.x, this.y, this.z] = typeof v === 'number' ? [this.x * v, this.y * v, this.z * v] : [this.x * v.x, this.y * v.y, this.z * v.z]
	}
	div(v) {
		[this.x, this.y, this.z] = typeof v === 'number' ? [this.x / v, this.y / v, this.z / v] : [this.x / v.x, this.y / v.y, this.z / v.z]
	}
	rotate(ang) {
		const d = ang => ang * (Math.PI / 180)
			, c = Math.cos
			, s = Math.sin[this.x,
				this.y] = [c(d(ang)) * this.x - s(d(ang)) * this.y, s(d(ang)) * this.x + c(d(ang)) * this.y]
	}
	dist(v) {
		const S = Math.sqrt
		return S(((this.x - v.x) * (this.x - v.x)) + ((this.y - v.y) * (this.y - v.y)) + ((this.z - v.z) * (this.z - v.z)))
	}
	dot(v, y = false, z) {
		return !y ? (this.x * v.x + this.y * v.y + this.z * v.z) : (this.x * v + this.y * y + this.z * z)
	}
	cross(v) {
		return new vec(this.y * v.z - v.y * this.z, this.z * v.x - v.z * this.x, this.x * v.y - v.x * this.y)
	}
	lerp(v, A, z = false, amt) {
		function l(v, t, a) {
			return (t - v) * a + v
		}
		[this.x, this.y, this.z] = !z ? [l(this.x, v.x, A), l(this.y, v.y, A), l(this.z, v.z, A)] : [l(this.x, v, amt), l(this.y, A, amt), l(this.z, z, amt)]
	}
	normalize() {
		this.mag() > 0 && this.div(this.mag())
	}
	limit(high) {
		this.mag() > high && (this.normalize(),
			this.mult(high))
	}
	heading() {
		return t(-this.y, this.x)
	}
	heading2d() {
		this.heading()
	}
	array() {
		return [this.x, this.y, this.z]
	}
	toString() {
		return this.array().toString()
	}
	static fromAngle(ang, v = new vec(), m = 1) {
		const c = Math.cos,
			s = Math.sin,
			d = ang => ang * (Math.PI / 180)
		v.x = c(d(ang)) * m
		v.y = s(d(ang)) * m
		return v
	}
	static random2d(v) {
		const r = Math.random
		return vec.fromAngle(r() * 360, v)
	}
	static random3d(v = false) {
		const r = Math.random,
			  S = Math.sqrt,
			  c = Math.cos,
			  s = Math.sin
		const ang = r() * (Math.PI * 2),
			    z = r() * 2 - 1,
			    m = S(1 - z ** 2),
			    x = m * c(ang),
			    y = m * s(ang)
		!v ? (v = new vec(x, y, z)) : v.set(x, y, z)
		return v
	}
	static sub(v, V) {
		return new vec(v.x - V.x, v.y - V.y, !v.z && !V.z ? 0 : v.z - V.z)
	}
	static angleBetween(v, V) {
		const a = Math.acos
		return a(v.dot(V) / (v.mag() * V.mag()))
	}
	static lerp(v, V, A) {
		v = new vec(v.x, v.y, v.z)
		v.lerp(V, A)
		return v
	}
}
