import MomentumType from './MomentumType';

let Types = {};

Types.string = class StringType extends MomentumType {
	static identifier = 'string'
	static validate(value){
		return toString.call(value) === '[object String]';
	}
}

export default Types;