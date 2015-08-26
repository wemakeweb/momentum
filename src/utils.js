export function isType(Type, obj){
	if(typeof obj === 'undefined'){
		return false;
	}
	return toString.call(obj) == '[object ' + Type.name + ']';
};


export function isFunction(obj){
	return toString.call(obj) == '[object Function]';
};


export const isClient = (() => typeof window !== 'undefined' && window.document && window.document.createElement )();