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

module.exports = chainchainchain;
//defaults
chainchainchain.settings = {
	ownchainonly: true,
	allowloops: false
}

//o[chi] = Chainchainchain {} //Chainchainchain[chi] = []
var chi = Symbol('chi');

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

function Chainchainchain (o, ch) {
	Object.defineProperties(this, {
		o: {
			value: o
		},
		ch: {
			value: ch || [],
			writable: true
		}
	});
}

function chainchainchain (o, ch) {
	//validate typeof ch
	if (ch && !(ch instanceof Array)) {
		throw new TypeError(ch+' is not an Array');
	}
	//if already initd return o's Chainchainchain
	if (o[chi] instanceof Chainchainchain) {
		o[chi][chi] = ch || o[chi][chi];
		return o[chi];
	}

	console.log('// ch init');

	var proxy = new Proxy(new Chainchainchain(o, ch), handler);
	o[chi] = proxy;

	return proxy;
}

chainchainchain.get = function (o) {
	return o[chi][chi];
}
