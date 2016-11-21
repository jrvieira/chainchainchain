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

/*TODO
	chain
	dechain
	inchain
	rechain
	get
	getget
	raw
	rawraw
	findloop-allowloops livro[89]

	method to retrieve the object from wich the requested prop came from (first prop in raw / rawraw)

OK	module export

	call vs apply vs bindy

	make warning when multiple instances of same object in chain
	make ch 'private' livro[89]

	objects only mode

	evaluation usage: o.chain.val ?
*/

'use strict';

module.exports = chainchainchain;
//defaults
chainchainchain.settings = {
	ownchainonly: true,
	allowloops: false,
	
}

var chi = Symbol();

var handle = {
	get: function (target, prop) {
		//get youngest
		if( prop in target.o ) return target.o[prop];
		console.log('// ch get young', prop);
		//return target[prop];
	},
	set: function (target, prop, value) {
		//set youngest
		if( prop in target.o ) return target.o[prop] = value;
		console.log('// ch set young', prop);
		//return target[prop] = value;
	}
}
//this makes the handler replaceable
var handler = handle;

function Ch (o) {
	this.o = o;
	this.ch = [];
}

function chainchainchain (o) {
	//if already initd return o's Ch
	if (o[chi] instanceof Ch) return o[chi];

	console.log('// ch init');

	var proxy = new Proxy(new Ch(o), handler);
	//typeof chi === 'symbol'
	o[chi] = proxy;

	return proxy;

}

const ch_ = Object.freeze({
	//adds objects to chain or returns chain when called with no arguments
	add: function () {
		if(!arguments.length){ //returns chain when called with no arguments
			return this._ch;
		} else {
			this._ch = this._ch || []; //guarantees chain array
			for (let i = 0; i < arguments.length; i ++) { //adds objects to chain
				this._ch.push(arguments[i]);
			}
			//FINDLOOPS
			return this;
		}
	},
	//removes objects from chain
	remove: function () {
		if(this._ch){
			if(!arguments.length){ //clears the chain when called with no arguments
				this._ch = [];
			}else{
				for (let i = 0; i < arguments.length; i ++) {	
					this._ch = this._ch.filter(function (o) {
					    return o !== arguments[i];
					});
				}
			}
		}
		return this;
	},
	//prepends objects to chain
	prepend: function () {
		this._ch = this._ch || []; //guarantees chain array
		for (let i = arguments.length; i > 0; i --) { //prepends objects to chain
			this._ch.unshift(arguments[i-1]);
		}
		//FINDLOOPS
		return this;
	},
	//replaces objects in chain
	replace: function (x,o) {
		this._ch = this._ch || []; //guarantees chain array
		while(!(this._ch.indexOf(x) < 0)){ //replaces objects in chain
			this._ch.splice(this._ch.indexOf(x),1,o);
		}
		//test this for multiple instances of same object in chain
		//FINDLOOPS
		return this;
	}/*,
	getproxy: function (caller) {

		return proxy = new Proxy({}, {
			get: function (obj, prop) {
				console.log(caller, obj, prop);
				return 'gotten value';
			}
			//,
			//set: function (obj, prop, value) {
			//	console.log(caller, t, n, v);
			//	//set value
			//}
		})

	}
	*/
});
