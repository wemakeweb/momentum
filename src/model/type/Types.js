import MomentumType from './MomentumType';

let Types = {};

Types.string = class StringType extends MomentumType {
	identifier = 'string'
	validate(value){
		return toString.call(value) === '[object String]';
	}
}

export default const MomentumTypes = Types;