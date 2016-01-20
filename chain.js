$(function(){
	
	Object.prototype.chain = function (){
		if(!this.chainage){
			this.chainage = [];
		}
		for(var i = 0; i < arguments.length; i++){
			this.chainage.push(arguments[i]);
		}
		return this;
	}
	
	Object.prototype.get = function (p,a,own){
		var victim = this;
		var prop = this[p];
		if(this.chainage){
			var i = 0;
			while(prop == undefined && i < this.chainage.length){
				prop = this.chainage[i][p];
				if(!own){victim = this.chainage[i]};
				i ++;
			}
		}
		if(prop instanceof Function){
			var a = (a instanceof Array) ? a : [];
			prop = prop.apply(victim,a);
		}
		return prop;
	}
	
	Object.prototype.getget = function (p,a,own,target){
		var victim = target||this;
		var prop = this[p];
		if(this.chainage){
			var i = 0;
			while(prop == undefined && i < this.chainage.length){
				prop = this.chainage[i].getget(p,a,own,(own ? this : undefined));
				if(!own&&!target){victim = this.chainage[i]};
				i ++;
			}
		}
		if(prop instanceof Function){
			var a = (a instanceof Array) ? a : [];
			prop = prop.apply(victim,a);
		}
		return prop;
	}
	
	Object.prototype.raw = function (p,a,own){
		var raw = [];
		raw.push(this.get(p,a,own));
		if(this.chainage){
			for(var i = 0; i < this.chainage.length; i ++){
				raw.push(this.chainage[i].get(p,a,own));
			}
		}
		return raw;
	}
	
	Object.prototype.rawraw = function (p,a,own){
		var raw = [];
		raw.push(this.getget(p,a,own));
		if(this.chainage){
			for(var i = 0; i < this.chainage.length; i ++){
				raw.push(this.chainage[i].getget(p,a,own));
			}
		}
		return raw;
	}
	
	Object.prototype.dechain = function (){
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
	
	Object.prototype.rechain = function (x,o){
		if(!this.chainage){
			this.chainage = [];
		}
		if(!(this.chainage.indexOf(x) < 0)){
			this.chainage.splice(this.chainage.indexOf(x),1,o);
		}
		return this;
	}
	
	Object.prototype.inchain = function (){
		if(!this.chainage){
			this.chainage = [];
		}
		for(var i = arguments.length; i > 0; i --){
			this.chainage.unshift(arguments[i-1]);
		}
	}
	
});