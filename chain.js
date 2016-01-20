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
	
	Object.prototype.get = function (p,a){
		var prop = this[p];
		if(this.chainage){
			var i = 0;
			while(prop == undefined && i < this.chainage.length){
				prop = this.chainage[i][p];
				i ++;
			}
			if(prop instanceof Function){
				var arg = (a instanceof Array) ? a : [];
				prop = prop.apply(this,arg);
			}
		}
		return prop;
	}
	
	Object.prototype.getAll = function (p,a){
		var props = [];
		if(this.chainage){
			for(var i = 0; i < this.chainage.length; i ++){
				if(this.chainage[i][p] instanceof Function){
					var arg = (a instanceof Array) ? a : [];
					props.push(this.chainage[i][p].apply(this,arg))
				}else{
					props.push(this.chainage[i][p]);
				}
			}
		}
		return props;
	}
	
	Object.prototype.dechain = function (){
		if(this.chainage){
			if(!arguments.length){
				this.chainage = [];
			}else{
				for(var i = 0; i < arguments.length; i ++){
					if(this.chainage[arguments[i]]){
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
			this.chainage.unshift(arguments[i]);
		}
	}
	
});