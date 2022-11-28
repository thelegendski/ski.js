//my collisions object
var col = {
	//rect-circle physics
	rcp: (a, b, s, m = 1) => {
		const x = constrain(a.x, m ? b.x - (b.width ?? b.w) / 2 : b.x, b.x + (b.width ?? b.w) / 2),
			y = constrain(a.y, b.y - (b.height ?? b.h) / 2, b.y + (b.height ?? b.h) / 2)
		s = s ?? a.size / 2
		if (dist(a.x, a.y, x, y) <= s) {
			const ang = atan2(a.x - x, a.y - y)
			return [
				x + sin(ang) * s,
				y + cos(ang) * s
			]
		}
	},
	//circle-circle physics
	ccp: (a, b, s) => {
		s = s ?? ((a.size ?? a.s) + (b.size ?? b.s))
		if (dist(a.x, a.y, b.x, b.y) <= s) {
			const ang = atan2(a.y - b.y, a.x - b.x)
			return [
				b.x + cos(ang) * s,
				b.y + sin(ang) * s
			]
		}
	},
	//circle-circle collisions
	cc: (a, b, s) => dist(a.x, a.y, b.x, b.y) <= (s ?? (a.size ?? a.s + b.size ?? b.s)) / 2,
	//rect-circle collisions
	rc: (a, b, m = 1) => dist(a.x, a.y, constrain(a.x, m ? b.x - b.width / 2 : min(b.x, b.x + b.width), m ? b.x + b.width / 2 : max(b.x, b.x + b.width)), constrain(a.y, m ? b.y - b.height / 2 : min(b.y, b.y + b.height), m ? b.y + b.height / 2 : max(b.y, b.y + b.height))) <= (a.size ?? a.s) / 2,
	//line-line collisions
	ll: (a, b, c, d) => {
		const on = (a, b, c) => b.x <= max(a.x, c.x) && b.x >= min(a.x, c.x) && b.y <= max(a.y, c.y) && b.y >= min(a.y, c.y),
			rot = (a, b, c) => {
				const val = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
				return val > 0 ? 1 : val >= 0 ? 0 : 2
			},
			o = [rot(a, b, c), rot(a, b, d), rot(c, d, a), rot(c, d, b)]
		return (o[0] !== o[1] && o[2] !== o[3]) || (o[0] === 0 && on(a, c, b)) || (o[1] === 0 && on(a, d, b)) || (o[2] === 0 && on(c, a, d)) || (o[3] === 0 && on(c, b, d))
	},
	//line-line intersection
	lli: (a, b, c, d) => {
		if (!col.ll(a, b, c, d)) return false
		const s = (((b.x - a.x) * (a.y - c.y)) + ((b.y - a.y) * c.x) - ((b.y - a.y) * a.x)) / (((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x)))
		return {
			x: c.x + (d.x - c.x) * s,
			y: c.y + (d.y - c.y) * s
		}
	},
	//circle-line collisions
	lc: (a, b, c) => {
		!c.size && (c.size = c.s || c.r)
		const rad = c.size / 2,
			ang = atan2(b.y - a.y, b.x - a.x) - 90,
			d = {
				x: c.x + cos(ang) * rad,
				y: c.y + sin(ang) * rad
			},
			e = {
				x: c.x + cos(ang) * -rad,
				y: c.y + sin(ang) * -rad
			},
			cache = [dist(a.x, a.y, c.x, c.y) <= rad, dist(b.x, b.y, c.x, c.y) <= rad],
			data = col.ll(a, b, d, e)
		return data || cache[0] || cache[1]
	},
	//circle-line intersection
	lci: (a, b, c) => {
		!c.size && (c.size = c.s || c.r)
		const rad = c.size / 2,
			ang = atan2(b.y - a.y, b.x - a.x) - 90,
			d = {
				x: c.x + cos(ang) * rad,
				y: c.y + sin(ang) * rad
			},
			e = {
				x: c.x + cos(ang) * -rad,
				y: c.y + sin(ang) * -rad
			},
			cache = [dist(a.x, a.y, c.x, c.y), dist(b.x, b.y, c.x, c.y)],
			data = col.ll(a, b, d, e);
		return data ? {
			c: d,
			d: e,
			0: rad
		} : cache[0] <= rad ? {
			int: a,
			0: rad,
			1: cache[0]
		} : cache[1] <= rad ? {
			int: b,
			0: rad,
			1: cache[1]
		} : false;
	},
	//circle-line physics
	lcp: (a, b, c) => {
		!c.size && (c.size = c.s || c.r)
		const cache = col.lci(a, b, c)
		if (!cache) return
		const int = cache.int || col.lli(a, b, cache.c, cache.d),
			distance = (cache[1] || dist(int.x, int.y, c.x, c.y)) - cache[0],
			angle = atan2(int.y - c.y, int.x - c.x)
		return [
			c.x + cos(angle) * distance, 
			c.y + sin(angle) * distance
		]
	}
}
window.col = col
