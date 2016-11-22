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

//o[chi] = Chainchainchain {} //Chainchainchain[chi] = []
var chi = Symbol('chi');

function Chainchainchain (o, ch = []) {
	Object.defineProperties(this, {
		o: {
			value: o
		},
		ch: {
			value: ch,
			writable: true
		}
	});
}

var handle = {
	get: function (target, prop) {
		if (prop === chi) return target.ch;
		//get youngest
		if (prop in target.o) return target.o[prop];
		console.log('// ch get young', prop);
		//return target[prop];
	},
	set: function (target, prop, value) {
		if (prop === chi) return target.ch = value;
		//set youngest
		if (prop in target.o) return target.o[prop] = value;
		console.log('// ch set young', prop);
		//return target[prop] = value;
	}
}
//this makes the handler replaceable
var handler = handle;

function chain (o, ch) {
	//validate o
	if (typeof o === 'undefined') throw new TypeError('Argument undefined');
	//validate typeof ch
	if (ch && !(ch instanceof Array)) throw new TypeError(ch+' is not an Array');
	//if already initd return o's Chainchainchain
	if (o[chi] instanceof Chainchainchain) {
		o[chi][chi] = ch || o[chi][chi];
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
	trees: false,
	loops: false
})

Object.defineProperties(chain, {

	set:{
		value: new Proxy(settings, {
			get: function (target, prop) {
				return !!target[prop];
			},
			set: function (target, prop, value) {
				//if (!(prop in target)) throw new Error(prop+' is not a setting');
				if (typeof value !== 'boolean') console.warn('Chain settings should be boolean, assuming '+!!value+' for '+prop);
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

			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array'); //initializes chain if not initialized yet

			if (!(oo instanceof Array)) oo = [oo];

			for (let i = 0; i < oo.length; i ++) { //adds objects to chain
				o[chi][chi].push(oo[i]);	console.log('pushing '+oo[i]+' from '+oo);
			}
			//FINDLOOPS

			return o[chi];
		}
	},

	pre: {
		value: function (o, oo = []) {

			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array'); //initializes chain if not initialized yet

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

			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array'); //initializes chain if not initialized yet

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

			if (!(chain.arr(o) instanceof Array)) throw new TypeError(o[chi][chi]+' is not an Array'); //initializes chain if not initialized yet

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
			return true;
		}
	},

	raw: {
		value: function (o, prop) {
			
		}
	}
	
});