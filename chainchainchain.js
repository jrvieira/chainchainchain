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
OK	chain
OK	dechain
OK	inchain
ok	rechain
	get
	getget
	raw
	rawraw
	findloop-allowloops

	module export

	test rechain for multiple instances of same obhect in chain
	make warning when multiple instances of same object in chain
*/

module.exports = chain;

'use strict';

const ch_ = {
	//adds objects to chain
	add: function () {
		this.ch = this.ch || []; //guarantees chain array
		for (let i = 0; i < arguments.length; i ++) { //adds objects to chain
			this.ch.push(arguments[i]);
		}
		//FINDLOOP
		return this;
	},
	//removes objects from chain
	rem: function () {
		if(this.ch){
			if(!arguments.length){
				this.ch = [];
			}else{
				for(let i = 0; i < arguments.length; i ++){
					while(this.ch.indexOf(arguments[i]) > -1){
						this.ch.splice(this.ch.indexOf(arguments[i]),1);
					}
				}
			}
		}
		return this;
	},
	//prepends objects to chain
	pre: function () {
		this.ch = this.ch || []; //guarantees chain array
		for (let i = arguments.length; i > 0; i --) { //prepends objects to chain
			this.ch.unshift(arguments[i]);
		}
		//FINDLOOP
		return this;
	},
	//replaces objects in chain
	rep: function (x,o) {
		this.ch = this.ch || []; //guarantees chain array
		if(!(this.ch.indexOf(x) < 0)){ //replaces objects in chain
			this.ch.splice(this.ch.indexOf(x),1,o);
		}
		//test this for multiple instances of same object in chain
		//FINDLOOP
		return this;
	}
}

//prepares object for chain
function chain (o,oo) { //object, object or array of objects to add to chain
	o.ch = []; //resets and attributes chain array
	if (oo) { //adds oo to chain
		(oo instanceof Array) ? o.ch = o.ch.concat(oo) : o.ch.push(oo);
	}
	//adds chain methods to o
	o.chain = ch_.add;
	o.dechain = ch_.rem;
	o.inchain = ch_.pre;
	o.rechain = ch_.rep;

	return o;
}
