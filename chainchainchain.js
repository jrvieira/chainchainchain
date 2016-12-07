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
	uniqueness: false, //prevent duplicate objects in chain
	allowloops: false, //allow loops (only happens when chaining Chainchainchain objects)
	setchained: false //values are set on its youngest owner in chain
});

const chi = Symbol('chi');

var handler = {
	get: function (arr, prop) {
		if (prop === chi) return arr;
		//if (prop === rvk) return arr.
		//get youngest
		var p;
		for (let o of arr) {
			if (typeof o[prop] !== 'undefined') {
				//x && y => if x is true returns y, else returns x
				p = o[prop] instanceof Function ? o[prop].bind(!settings.owncontext && arr[0] || o) : o[prop];
			}
		}
		return p;
	},
	set: function (arr, prop, value) {
		var origin = arr[0];
		if (!settings.setchained) return origin[prop] = value;
		//set youngest
		for (let o of arr) {
			if (typeof o[prop] !== 'undefined') {
				return o[prop] = value;
			}
		}
		console.warn(prop+' is not a chained property');
		return false;
	}
}

function chain (...arr) {
	//validate o
	if (typeof arr === 'undefined') throw new TypeError('Argument undefined');
	//validate ch
	console.log('// ch init');
	//FINDLOOPS

	return new Proxy(arr, handler);
}

Object.defineProperties(chain, {

	set:{
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
	//returns origin object
	origin: {
		value: function (ch) {
			return ch[chi][0] || false;
		}
	},
	//returns chain's array of objects
	is: {
		value: function (ch) { //leaks
			return ch[chi] ? true : false;
		}
	},
	//returns chain's array of objects
	arr: {
		value: function (ch) { //leaks
			return ch[chi] ? [...ch[chi]] : false;
		}
	},
	//MANIPULATION
	//adds objects to end of chain
	add: {
		value: function (ch, oo = []) {
			if (!ch[chi]) throw new TypeError(ch+' is not a chain');
			if (!(oo instanceof Array)) oo = [oo];
			//appends objects to chain
			ch[chi].push(...oo);
			//FINDLOOPS

			return [...ch[chi]];
		}
	},
	//adds objects to beggining of chain
	pre: {
		value: function (ch, oo = []) {
			if (!ch[chi]) throw new TypeError(ch+' is not a chain');
			if (!(oo instanceof Array)) oo = [oo];
			//prepends objects to chain
			ch[chi].splice(1, 0, oo);
			//FINDLOOPS

			return [...ch[chi]];
		}
	},
	//removes objects from chain
	rem: {
		value: function (ch, xx = []) {
			if (!ch[chi]) throw new TypeError(ch+' is not a chain');
			if (!(xx instanceof Array)) xx = [xx];
			//filters objects out of chain
			for (let x of xx) {	
				ch[chi] = ch[chi].filter(function (o) {
				    return o !== x;
				});
			}

			return [...ch[chi]];
		}
	},
	//replaces objects from chain
	rep: {
		value: function (ch, x, o) {
			if (!ch[chi]) throw new TypeError(ch+' is not a chain');
			//replaces objects in chain
			while (!(ch[chi].indexOf(x) < 0)) {
				console.info(ch[chi], x ,ch[chi].indexOf(x));
				ch[chi].splice(ch[chi].indexOf(x),1,o);
				console.info(ch[chi]);
			}
			//FINDLOOPS

			return [...ch[chi]];
		}
	},
	//returns array of properties in chain
	raw: {
		value: function (ch, prop, callback) {
			if (!ch[chi]) throw new TypeError(ch+' is not a chain');
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
	}
	
});
