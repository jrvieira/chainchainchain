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
const chi = Symbol('chi');
//o[chi][cho] = o
const cho = Symbol('cho');

const Chainchainchain = function (o, ch = []) {
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
		var ch = target[chi];

		var p = o[prop];
		var owner = o;

		var i = 0;

		while (p === undefined && i < ch.length) {
			p = ch[i][prop];
			owner = ch[i];
			i++;
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
	if (o instanceof Chainchainchain) throw new Error('Chainchainchain objects cannot originate chains');
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
	uniqueness: false, //prevent duplicate objects in chain
	allowloops: false //allow loops (only happens when chaining Chainchainchain objects)
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

	origin: {
		value: function (ochain) {
			if (!(ochain instanceof Chainchainchain)) throw new TypeError(ochain+' is not a Chainchainchain object');
			
			return ochain[cho];
		}
	},

	arr: {
		value: function (ochain) {
			if (!(ochain instanceof Chainchainchain)) throw new TypeError(ochain+' is not a Chainchainchain object');

			return ochain[chi];
		}
	},
	//MANIPULATION
	add: {
		value: function (ochain, oo = []) {
			if (!(ochain instanceof Chainchainchain)) throw new TypeError(ochain+' is not a Chainchainchain object');

			if (!(oo instanceof Array)) oo = [oo];

			for (let i = 0; i < oo.length; i ++) { //adds objects to chain
				ochain[chi].push(oo[i]);
			}
			//FINDLOOPS

			return ochain;
		}
	},

	pre: {
		value: function (ochain, oo = []) {
			if (!(ochain instanceof Chainchainchain)) throw new TypeError(ochain+' is not a Chainchainchain object');

			if (!(oo instanceof Array)) oo = [oo];

			for (let i = oo.length; i > 0; i --) { //prepends objects to chain
				ochain[chi].unshift(oo[i-1]);
			}
			//FINDLOOPS

			return ochain;
		}
	},

	rem: {
		value: function (ochain, oo = []) {
			if (!(ochain instanceof Chainchainchain)) throw new TypeError(ochain+' is not a Chainchainchain object');
			
			if (!(oo instanceof Array)) oo = [oo];

			for (let i = 0; i < oo.length; i ++) {	
				ochain[chi] = ochain[chi].filter(function (o) {
				    return o !== oo[i];
				});
			}

			return ochain;
		}
	},

	rep: {
		value: function (ochain, x, n) {
			if (!(ochain instanceof Chainchainchain)) throw new TypeError(ochain+' is not a Chainchainchain object');

			while (!(ochain[chi].indexOf(x) < 0)) { //replaces objects in chain
				ochain[chi].splice(ochain[chi].indexOf(x),1,n);
			}
			//FINDLOOPS

			return ochain;
		}
	},

	del: {
		value: function (o) {
			//delete everything of o, revoke proxies
			//revoke proxy
			return (delete o[chi]);
		}
	},

	raw: {
		value: function (ochain, p, callback) {
			if (!(ochain instanceof Chainchainchain)) throw new TypeError(ochain+' is not a Chainchainchain object');
			//validate p
			if (typeof p === 'undefined') throw new TypeError('Argument undefined');
			
			//proto = o + oo
			var proto = [ochain[cho],...ochain[chi]];
			//x && y => if x is true returns y, else returns x
			var ocontext = !settings.owncontext && ochain[cho];

			var raw = [];

			for (let i = 0; i < proto.length; i ++) {
				if (proto[i][p] instanceof Function) {
					raw.push(proto[i][p].bind(ocontext || proto[i]));
				} else {
					raw.push(proto[i][p]);
				}
			}

			return callback(raw);
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