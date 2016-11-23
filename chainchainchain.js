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

module.exports = chain;
//defaults

//o[chi] = Chainchainchain {} //o[chi][chi] = []
var chi = Symbol('chi');
//o[chi][cho] = o
var cho = Symbol('cho');

function Chainchainchain (o, ch = []) {
	Object.defineProperties(this, {
		[cho]: {
			value: o
		},
		[chi]: {
			value: ch,
			writable: true
		}
	});
}

var handler = {
	get: function (target, prop) {
		if (prop === chi) return target[chi];
		if (prop === cho) return target[cho];
		//get youngest
		var o = target[cho];
		var proto = [o,...target[chi]];
		var p, owner;

		for (let oo of proto) {
			p = oo[prop];
			owner = oo;
			if (!(p === undefined)) break;
		}

		if (p instanceof Function) {
			//x && y => if x is true returns y, else returns x
			p = p.bind(!settings.owncontext && o || owner);
		}

		return p;
	},
	set: function (target, prop, value) {
		if (prop === chi) return target[chi] = value;
		//if (prop === cho) return target[cho] = value; //cho never changes
		//set youngest
		var o = target[cho];
		if (prop in o) {
			return o[prop] = value;
		} else {
			for (let oo of target[chi]) {
				if (prop in oo) return oo[prop] = value;
			}
		}
		console.warn(prop+' is not a chained property.');
		return false;
	}
}

function chain (o, ch = []) {
	//validate o
	if (typeof o === 'undefined') throw new TypeError('Argument undefined');
	if (o instanceof Chainchainchain) throw new Error('Chainchainchain objects cannot be chained');
	//validate ch
	if (!(ch instanceof Array)) ch = [ch];
	//if already initd return o's Chainchainchain and reset chain if second argument is provided
	if (o[chi] instanceof Chainchainchain && o[chi][cho] === o) {
		o[chi][chi] = ch.length ? ch : o[chi][chi];
		return o[chi];
	}

	console.log('// ch init');

	//FINDLOOPS HERE OR

	var proxy = new Proxy(new Chainchainchain(o, ch), handler);
	o[chi] = proxy;

	//HERE ? FINDLOOPS

	return proxy;
}

//every setting defaults to false
var settings = Object.preventExtensions({
	owncontext: false, //functions remain in owner's context
	uniqueness: false, //allow duplicate objects in chain
	chaintrees: false, //lookup chained object's chains
	allowloops: false //allow loops
})

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

	arr: {
		value: function (o) {
			return chain(o)[chi]; //initializes chain if not initialized yet
		}
	},
	//MANIPULATION
	add: {
		value: function (o, oo = []) {
			//initializes if not yet and typechecks
			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array');

			if (!(oo instanceof Array)) oo = [oo];

			for (let i = 0; i < oo.length; i ++) { //adds objects to chain
				o[chi][chi].push(oo[i]);
			}
			//FINDLOOPS

			return o[chi];
		}
	},

	pre: {
		value: function (o, oo = []) {
			//initializes if not yet and typechecks
			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array');

			if (!(oo instanceof Array)) oo = [oo];

			for (let i = oo.length; i > 0; i --) { //prepends objects to chain
				o[chi][chi].unshift(oo[i-1]);
			}
			//FINDLOOPS

			return o[chi];
		}
	},

	rem: {
		value: function (o, oo = []) {
			//initializes if not yet and typechecks
			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array');
			
			if (!(oo instanceof Array)) oo = [oo];

			for (let i = 0; i < oo.length; i ++) {	
				o[chi][chi] = o[chi][chi].filter(function (o) {
				    return o !== oo[i];
				});
			}

			return o[chi];
		}
	},

	rep: {
		value: function (o, x, n) {
			//initializes if not yet and typechecks
			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array');

			while (!(o[chi][chi].indexOf(x) < 0)) { //replaces objects in chain
				o[chi][chi].splice(o[chi][chi].indexOf(x),1,n);
			}
			//FINDLOOPS

			return o[chi];
		}
	},

	del: {
		value: function (o) {
			//delete everything of o, revoke proxies
			return (delete o[chi]);
		}
	},

	raw: {
		value: function (o, p) {
			//validate p
			if (typeof p === 'undefined') throw new TypeError('Argument undefined');
			//initializes if not yet and typechecks
			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array');
			//proto = o + oo
			var proto = [o,...o[chi][chi]];
			//x && y => if x is true returns y, else returns x
			var ocontext = !settings.owncontext && o;

			var raw = [];

			for (let i = 0; i < proto.length; i ++) {
				if (proto[i][p] instanceof Function) {
					raw.push(proto[i][p].bind(ocontext || proto[i]));
				} else {
					raw.push(proto[i][p]);
				}
			}

			return raw;
		}
	},
	/*debugging
	chi: {
		value: chi
	},
	cho: {
		value: cho
	}
	*/
	
});