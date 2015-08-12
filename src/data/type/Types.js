import MomentumType from './MomentumType';

let Types = {};

Types.string = class StringType extends MomentumType {
	static identifier = 'string'
	static validate(value){
		return toString.call(value) === '[object String]';
	}
}

Types.number = class NumberType extends MomentumType {
	static identifier = 'number'
	static validate(value){
		return !isNaN(parseFloat(value)) && isFinite(value);
	}
}

export default Types;