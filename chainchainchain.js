/*
MIT License

Copyright (c) 2016 José Rafael Vieira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

//export default chain; //import chain from 'chainchainchain'
module.exports = chain;

//every setting defaults to false
var settings = Object.preventExtensions({
	owncontext: false, //functions remain in owner's context
	//uniqueness: false, //prevent duplicate objects in chain
	allowloops: false, //allow loops (only happens when chaining Ch objects)
	setchained: false //values are set on its youngest owner in chain
});

const chi = Symbol('chi');

var handler = {
	get: function (target, prop) {
		if (prop === chi) return target[chi];
		//if (prop === rvk) return target.
		//get youngest
		var p;
		var avoid = chain.findloop(target);
		if (!settings.allowloops && avoid) throw new Error('Loop in chain', avoid);

		for (let o of target[chi]) {

			if (avoid && avoid === o) return false;

			if (typeof o[prop] !== 'undefined') {
				//x && y => if x is true returns y, else returns x
				return o[prop] instanceof Function ? o[prop].bind(!settings.owncontext && target[chi][0] || o) : o[prop];
			}
		}
		return p;
	},
	set: function (target, prop, value) {
		if (prop === chi) return target[chi] = value;
		var origin = target[chi][0];
		if (!settings.setchained) return origin[prop] = value;
		//set youngest
		for (let o of target[chi]) {
			if (typeof o[prop] !== 'undefined') {
				return o[prop] = value;
			}
		}
		console.warn(prop+' is not a chained property');
		return false;
	}
}

function Ch (arr) {
	this[chi] = arr;
}

function chain (...arr) {
	//validate o
	if (typeof arr === 'undefined') throw new TypeError('Argument undefined');
	//validate ch
	console.log('// ch init');

	var ch = new Proxy(new Ch(arr), handler);
	//find loops
	if (chain.findloop(ch)) {
		if (!settings.allowloops) throw new Error('Loop in chain', chain.findloop(ch));
		console.warn('Loop in chain', chain.findloop(ch));
	}

	return ch;
}

Object.defineProperties(chain, {

	set: {
		value: new Proxy(settings, {
			get: function (target, prop) {
				return !!target[prop];
			},
			set: function (target, prop, value) {
				//if (!(prop in target)) throw new Error(prop+' is not a setting');
				if (typeof value !== 'boolean') console.warn('Chain settings should be Boolean, assuming '+!!value+' for '+prop);
				return target[prop] = !!value;
			}
		})
	},
	//if you create a loop there is a RangeError: Maximum call stack size exceeded
	//so this method and the allowloops setting is obsolete ?
	findloop: {
		value: function (ch, set = new Set()) {
			set.add(ch);
			for (let o of ch[chi]) {
				if ( chain.is(o) && ( set.has(o) || chain.findloop(o, set) ) ) {
					return o;
				}
			}
			return false;
		}
	},
	//returns true if object is chain
	is: {
		value: function (ch) {
			return ch instanceof Ch ? true : false;
		}
	},
	//returns origin object
	origin: {
		value: function (ch) {
			return ch[chi][0] || false;
		}
	},
	//returns chain's array of objects
	arr: {
		value: function (ch) {
			return ch[chi] ? [...ch[chi]] : false;
		}
	},
	//returns array of properties in chain
	raw: {
		value: function (ch, prop, callback) {
			if (!(ch instanceof Ch)) throw new TypeError(ch+' is not a chain');
			//validate p
			if (typeof prop === 'undefined') throw new TypeError('Argument undefined');

			var raw = [];
			var own = [];

			for (let o of ch[chi]) {
				//x && y => if x is true returns y, else returns x
				raw.push(o[prop] instanceof Function ? o[prop].bind(!settings.owncontext && ch[chi][0] || o) : o[prop]);
				if (callback) own.push(o);
			}

			return callback ? callback(raw, own) : raw;
		}
	},
	//MANIPULATION
	//adds objects to end of chain
	add: {
		value: function (ch, oo = []) {
			if (!(ch instanceof Ch)) throw new TypeError(ch+' is not a chain');
			if (!(oo instanceof Array)) oo = [oo];
			//appends objects to chain
			ch[chi].push(...oo);
			//find loops
			if (chain.findloop(ch)) {
				if (!settings.allowloops) throw new Error('Loop in chain', chain.findloop(ch));
				console.warn('Loop in chain', chain.findloop(ch));
			}

			return [...ch[chi]];
		}
	},
	//adds objects to beggining of chain
	pre: {
		value: function (ch, oo = []) {
			if (!(ch instanceof Ch)) throw new TypeError(ch+' is not a chain');
			if (!(oo instanceof Array)) oo = [oo];
			//prepends objects to chain
			ch[chi].unshift(...oo);
			//find loops
			if (chain.findloop(ch)) {
				if (!settings.allowloops) throw new Error('Loop in chain', chain.findloop(ch));
				console.warn('Loop in chain', chain.findloop(ch));
			}

			return [...ch[chi]];
		}
	},
	//replaces objects from chain
	rep: {
		value: function (ch, x, o) {
			if (!(ch instanceof Ch)) throw new TypeError(ch+' is not a chain');
			//replaces objects in chain
			while (!(ch[chi].indexOf(x) < 0)) {
				ch[chi].splice(ch[chi].indexOf(x),1,o);
			}
			//find loops
			if (chain.findloop(ch)) {
				if (!settings.allowloops) throw new Error('Loop in chain', chain.findloop(ch));
				console.warn('Loop in chain', chain.findloop(ch));
			}

			return [...ch[chi]];
		}
	},
	//removes objects from chain
	rem: {
		value: function (ch, xx = []) {
			if (!(ch instanceof Ch)) throw new TypeError(ch+' is not a chain');
			if (!(xx instanceof Array)) xx = [xx];
			//filters objects out of chain
			ch[chi] = ch[chi].filter(function (o) {
				return !xx.includes(o);
			});

			return [...ch[chi]];
		}
	},
	//removes last object from chain
	pop: {
		value: function (ch) {
			if (!(ch instanceof Ch)) throw new TypeError(ch+' is not a chain');

			return ch[chi].pop();
		}
	},
	//removes first object from chain
	shift: {
		value: function (ch) {
			if (!(ch instanceof Ch)) throw new TypeError(ch+' is not a chain');

			return ch[chi].shift();
		}
	},
	//removes last object from chain
	rol: {
		value: function (ch, n = 1) {
			if (!(ch instanceof Ch)) throw new TypeError(ch+' is not a chain');

			if (n > 0) {
				for (let i = 0; i < n; i ++) {
					ch[chi].push(ch[chi].shift());
				}
			} else if (n < 0) {
				for (let i = 0; i > n; i --) {
					ch[chi].unshift(ch[chi].pop());
				}
			}

			return [...ch[chi]];

		}
	}

});
