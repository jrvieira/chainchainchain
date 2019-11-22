// import chain from 'chainchainchain'
//export default chain
module.exports = chain

let settings = Object.preventExtensions({
	owncontext: false, // functions remain in owner's context
	//uniqueness: false, // prevent duplicate objects in chain
	allowloops: false, // allow loops (only happens when chaining Ch objects)
	setchained: false // values are set on the youngest chained owner
}) // every setting defaults to false

const origin = Symbol('origin')
const chi = Symbol('chi')

function Ch (arr) {
	this[origin] = {}
	this[chi] = arr
}

let handler = {
	get (target, prop, receiver) {
		// return origin
		if (prop === origin) return target[origin]
		// return chi
		if (prop === chi) return target[chi]
		// avoid loop object
		let avoid = chain.findloop(target)

		if (!settings.allowloops && avoid) throw new Error(`Loop in chain: ${avoid}`)
		// iterate through origin and chained objects
		for (let o of [target[origin], ...target[chi]]) {
			// return false on loop object
			if (avoid && avoid === o) return false
			// if object has property
			if (typeof o[prop] !== 'undefined') {
				// return property or properly bound method
				return o[prop] instanceof Function && settings.owncontext ? o[prop].bind(o) : o[prop]
			}
		}

		return undefined
	},
	set (target, prop, value) {
		// set chi
		if (prop === chi) return target[chi] = value
		// set origin
		if (!settings.setchained) return target[origin][prop] = value
		// iterate through origin and chained objects
		let r = false
		for (let o of [target[origin], ...target[chi]]) {
			// if object has property
			if (typeof o[prop] !== 'undefined') {
				// set it
				o[prop] = value
				r = true
			}
		}
		if (r) {
			return value
		} else {
			throw new Error(`Trying to set a non-existent chained property: ${prop}`)
		}
	},
	has (target, key) {
		let has = false
		for (let o of [target[origin], ...target[chi]]) {
			if (key in o) return true
		}
		return false
	},
	deleteProperty (target, prop) {

		if (!settings.setchained) return delete target[origin][prop]

		let r = true

		for (let o of [target[origin], ...target[chi]]) {
			// if object has property
			if (typeof o[prop] !== 'undefined') {
				// delete it
				r = r && delete o[prop]
			}
		}
		// delete throws in strict mode if the property is an own non-configurable property (returns false in non-strict)
		// returns true in all other cases
		return r
	}
}

function chain (...oo) {
	// validate o
	if (typeof oo === 'undefined') throw new TypeError('Argument undefined')
	// create proxied Ch instance
	let ch = Object.seal(new Ch(oo))
	let p = new Proxy(ch, handler)
	// find loops
	if (chain.findloop(p)) {
		if (!settings.allowloops) throw new Error(`Loop in chain: ${chain.findloop(p)}`)
		console.warn('Loop in chain', chain.findloop(p))
	}

	return p
}

Object.defineProperties(chain, {
	// settings object
	set: {
		value: new Proxy(settings, {
			get (target, prop) {

				return !!target[prop]
			},
			set (target, prop, value) {
				//if (!(prop in target)) throw new Error(`${prop} is not a setting`)
				if (typeof value !== 'boolean') console.warn('Chain settings should be Boolean, assuming', !!value, 'for', prop)

				return target[prop] = !!value
			}
		})
	},
	// mind that if you create a loop there is a RangeError: Maximum call stack size exceeded
	findloop: {
		value: function (ch, set = new Set()) {

			set.add(ch)

			for (let o of ch[chi]) {
				if (chain.is(o) && (set.has(o) || chain.findloop(o, set))) {
					return o
				}
			}

			return false
		}
	},
	// returns true if object is chain
	is: {
		value: function (ch) {

			return ch instanceof Ch ? true : false
		}
	},
	// returns origin object
	origin: {
		value: function (ch) {

			validatechtype(ch)

			return ch[origin]
		}
	},
	// returns array of objects in chain
	arr: {
		value: function (ch) {

			return chain.is(ch) ? [ch[origin], ...ch[chi]] : false
		}
	},
	// returns array of properties in chain
	raw: {
		value: function (ch, prop, callback) {

			validatechtype(ch)
			// validate p
			if (typeof prop === 'undefined') throw new TypeError('Argument undefined')

			let raw = []
			// iterate through origin and chained objects
			for (let o of [ch[origin], ...ch[chi]]) {
				// memo property or properly bound method
				raw.push(o[prop])
			}

			return callback ? callback(raw) : raw
		}
	},
	// MANIPULATION
	// adds objects to chain
	add: {
		value: function (ch, oo = []) {

			validatechtype(ch)

			if (!(oo instanceof Array)) oo = [oo]
			// appends objects to chain
			ch[chi].push(...oo)
			// find loops
			if (chain.findloop(ch)) {
				if (!settings.allowloops) throw new Error(`Loop in chain: ${chain.findloop(ch)}`)
				console.warn('Loop in chain', chain.findloop(ch))
			}

			return [ch[origin], ...ch[chi]]
		}
	},
	// adds objects to chain, after the origin
	pre: {
		value: function (ch, oo = []) {

			validatechtype(ch)

			if (!(oo instanceof Array)) oo = [oo]
			// prepends objects to chain
			ch[chi].unshift(...oo)
			// find loops
			if (chain.findloop(ch)) {
				if (!settings.allowloops) throw new Error(`Loop in chain: ${chain.findloop(ch)}`)
				console.warn('Loop in chain', chain.findloop(ch))
			}

			return [ch[origin], ...ch[chi]]
		}
	},
	// replaces chained objects
	rep: {
		value: function (ch, x, o) {

			validatechtype(ch)

			if (typeof x === 'undefined' || typeof o === 'undefined') throw new Error('not enough arguments')
			// replaces objects in chain
			while (!(ch[chi].indexOf(x) < 0)) {
				ch[chi].splice(ch[chi].indexOf(x),1,o)
			}
			// find loops
			if (chain.findloop(ch)) {
				if (!settings.allowloops) throw new Error(`Loop in chain: ${chain.findloop(ch)}`)
				console.warn('Loop in chain', chain.findloop(ch))
			}

			return [ch[origin], ...ch[chi]]
		}
	},
	// removes chained objects
	rem: {
		value: function (ch, xx = []) {

			validatechtype(ch)

			if (!(xx instanceof Array)) xx = [xx]
			// filters objects out of chain
			ch[chi] = ch[chi].filter(o => !xx.includes(o))

			return [ch[origin], ...ch[chi]]
		}
	},
	// removes last chained object
	pop: {
		value: function (ch) {

			validatechtype(ch)

			return ch[chi].pop()
		}
	},
	// removes first chained object
	shift: {
		value: function (ch) {

			validatechtype(ch)

			return ch[chi].shift()
		}
	},
	// rotates chained objects
	rol: {
		value: function (ch, n = 1) {

			validatechtype(ch)

			if (n > 0) {
				for (let i = 0; i < n; i ++) {
					ch[chi].push(ch[chi].shift())
				}
			} else if (n < 0) {
				for (let i = 0; i > n ;i --) {
					ch[chi].unshift(ch[chi].pop())
				}
			}

			return [ch[origin], ...ch[chi]]
		}
	}

})

function validatechtype (ch) {
	if (!chain.is(ch)) throw new TypeError(`Not a chain: ${ch}`)
}
