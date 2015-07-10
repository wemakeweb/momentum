export function isType(Type, obj){
	if(typeof obj === 'undefined'){
		return false;
	}
	return toString.call(obj) == '[object ' + Type.name + ']';
};


export const isClient = (() => typeof window !== 'undefined' )();