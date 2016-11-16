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

(function() {



	if(!console){
		console = {
			log: function(){},
			warn: function(){}
		}
	}

	Object.defineProperties(Object.prototype, {
		findloop: {
			value: function (a){
				var arr = a || [this];
				if(this.chainage){
					for(var i = 0; i < this.chainage.length; i++){
						if(arr.indexOf(this.chainage[i])>-1){
							console.warn('Looping',this.chainage[i]);	throw new Error('loop in chain tree');
						}else{
							arr.push(this.chainage[i]);
							this.chainage[i].findloop(arr);
						}
					}
				}else{
					return false;
				}
			}
		},
		chain: {
			value: function (){
				if(!this.chainage){
					this.chainage = [];
				}
				for(var i = 0; i < arguments.length; i++){
					this.chainage.push(arguments[i]);
					if(Object.prototype.chain.allowloops == false){
						this.findloop();
					}
				}
				return this;
			}
		},
		get: {
			value: function (p,own){
				var prop = this[p];
				var that = this;
				if(this.chainage){
					var i = 0;
					while(typeof prop === 'undefined' && i < this.chainage.length){
						if(!own){that = this.chainage[i]}
						prop = this.chainage[i][p];
						i ++;
					}
				}
				if(prop instanceof Function){
					return function (){
						var args = [];
						for(var i = 0; i < arguments.length; i ++){
							args.push(arguments[i]);
						}
						return prop.apply(that,args);
					}
				}
				return prop;
			}
		},
		getget: {
			value: function (p,own,recursion){
				if(typeof p != 'string'){throw new Error('Getget: property name cannot be '+p+'.');}
				if(Object.prototype.chain.allowloops == true){console.warn('Getget called while chain.allowloops is set to '+chain.allowloops+'.')}
				var prop = this[p];
				var that = (recursion && own)?own:this;
				if(this.chainage){
					var i = 0;
					while(typeof prop === 'undefined' && i < this.chainage.length){
						if(!own){that = this.chainage[i]}
						prop = this.chainage[i].getget(p,(own?that:false),true);
						i ++;
					}
				}
				if(prop instanceof Function){
					return function (){
						var args = [];
						for(var i = 0; i < arguments.length; i ++){
							args.push(arguments[i]);
						}
						return prop.apply(that,args);
					}
				}
				return prop;
			}
		},
		raw: {
			value: function (p,own){
				var raw = [this[p]];
				var that = [this];
				if(this.chainage){
					for(var i = 0; i < this.chainage.length; i ++){
						own ? that.push(this) : that.push(this.chainage[i]);
						raw.push(this.chainage[i][p]);
					}
				}
				var raw2 = [];
				for(var ii = 0; ii < raw.length; ii ++){
					if(raw[ii] instanceof Function){
						var meth = raw[ii];
						var vic = that[ii];
						raw2.push(function (){
							var args = [];
							for(var i = 0; i < arguments.length; i ++){
								args.push(arguments[i]);
							}
							return meth.apply(vic,args);
						});
					}else{
						raw2.push(raw[ii]);
					}
				}
				return raw2;
			}
		},
		rawraw: {
			value: function (p,own){
				if(typeof p != 'string'){throw new Error('Rawraw: property name cannot be '+p+'.');}
				var args = [];
				args.push(this.getget(p,own?this:false,true));
				if(this.chainage){
					for(var i = 0; i < this.chainage.length; i ++){
						args.push(this.chainage[i].getget(p,own?this:false,true));
					}
				}
				return args;
			}
		},
		dechain: {
			value: function (){
				if(this.chainage){
					if(!arguments.length){
						this.chainage = [];
					}else{
						for(var i = 0; i < arguments.length; i ++){
							while(this.chainage.indexOf(arguments[i]) > -1){
								this.chainage.splice(this.chainage.indexOf(arguments[i]),1);
							}
						}
					}
				}
				return this;
			}
		},
		rechain: {
			value: function (x,o){
				if(!this.chainage){
					this.chainage = [];
				}
				if(!(this.chainage.indexOf(x) < 0)){
					this.chainage.splice(this.chainage.indexOf(x),1,o);
				}
				return this;
			}
		},
		inchain: {
			value: function (){
				if(!this.chainage){
					this.chainage = [];
				}
				for(var i = arguments.length; i > 0; i --){
					this.chainage.unshift(arguments[i-1]);
				}
				return this;
			}
		}
	})

	Object.prototype.chain.allowloops = false;



}());