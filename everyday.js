/*
 * 调用Object原型中的toString函数
 * 这时会返回一个 [object XXX] 的字符串，XXX就是对象构造函数的名称
 * 此方法用于判断复杂JS类型，弥补typeof的盲区
 */
function tStr(o){ return(typeof(o)) }
function oStr(o){ return(Object.prototype.toString.call(o)) }
function isNumber(o){ return(tStr(o) == 'number') }
function isString(o){ return(tStr(o) == 'string') }
function isBoolean(o){ return(tStr(o) == 'boolean') }
function isUndefined(o){ return(tStr(o) == 'undefined') }
function isLiteral(o){ return(isString(o) || isBoolean(o) || isNumber(o)) }
function isValidString(s){ return(isString(s) && s.length > 0) }
function isArray(o){ return(oStr(o) == '[object Array]') }
function isNull(o){ return(o === null) }
function isEmpty(o){ return(tStr(o) == 'undefined' || isNull(o)) }
function isFunction(o){ return(tStr(o) == 'function') }
function isObject(o){ return(oStr(o) == '[object Object]') }

/*
 * 首先，这种特有的注释只有IE能识别，并且根本不认作是注释，会执行。
 * 在低版本IE中，并不存在HTMLElement之类的基础类，并且普通的对象({})和节点的typeof-string都是object
 * 但是两者有一点差别：节点对象没有constructor
 * 以此为依据，判断对象是否是普通对象
 */
/*@cc_on
if(!document.constructor){
  isObject = function (o){ return(!isNull(o) && tStr(o) == 'object' && isFunction(o.constructor)) }
}
@*/

var ARR = {
	each : function(arr, callback){
		var i = 0, len = arr.length;
		while(i < len){
			if(callback(arr[i], i, arr)) break;
			i++;
		}
	},
	some : function(arr, callback){
		var i = 0, len = arr.length;
		while(i < len){
			if(callback(arr[i], i, arr)) return(true);
			i++;
		}
		return(false);
	},
	every : function(arr, callback){
		var i = 0, len = arr.length;
		while(i < len){
			if(!callback(arr[i], i, arr)) return(false);
			i++;
		}
		return(true);
	},
	filter : function(arr, callback){
		var A = [], i = 0, len = arr.length;
		while(i < len){
			callback(arr[i], i, arr) && A.push(arr[i]);
			i++;
		}
		return A;
	},
	clear : function(arr){
		arr.splice(0, arr.length);
	},
	slice : function(obj, index, length){
		if(tStr(length) == 'undefined') length = obj.length;
		return Array.prototype.slice.apply(obj, [index || 0, length]);
	}
}

ARR.indexOf = 'indexOf' in Array.prototype
	? function(arr, val){ return(arr.indexOf(val)) }
	: function(arr, val){
		var i = 0, len = arr.length;
		while(i < len){
			if(arr[i] === val) return i;
			i++;
		}
		return(-1);
	}

var OBJ = {
	each : function(obj, callback){
		for(var p in obj){
			if(callback(obj[p], p, obj)) break;
		}
	},
	some : function(obj, callback){
		for(var p in obj){
			if(callback(obj[p], p, obj)) return(true);
		}
		return(false);
	},
	every : function(obj, callback){
		for(var p in obj){
			if(!callback(obj[p], p, obj)) return(false);
		}
		return(true);
	},
	indexOf : function(obj, val){
		for(var p in obj){
			if(callback(obj[p], p, obj)) return(p);
		}
		return(null);
	},
	count : function(obj){
		if(!obj) return(0);
		var i = 0, p;
		for(p in obj) ++i;
		return(i);
	},
	empty : function(obj){
		if(obj) for(var p in obj) return(false);
		return(true)
	},
	columns : function(obj){
		var arr = [];
		if(!obj) return arr;
		for(var p in obj) arr.push(p);
		return arr;
	}
}

var STR = {
	each : function(str, callback){
		ARR.each(str, callback);
	},
	count : function(str, subStr){
		var i = 0, idx = -1;
		while((idx = str.indexOf(subStr, idx + 1)) > -1)++i;
		return i;
	},
	trim : function(s, chars){
		var reg = new RegExp('^' + (chars = chars || '\\s') + '+|' + chars + '+$', 'g');
		return s.replace(reg, '');
	},
	htmlEncode : function(s){
		return s.toString().replace(/\</g, '&lt;').replace(/\>/g, '&gt;')/*.replace(/\&/g, '&amp;')*/;
	},
	htmlDecode : function(s){
		return s.toString().replace(/\&amp;/g, '&').replace(/\&lt;/g, '<').replace(/\&gt;/g, '>');
	}
}
