export default class MomentumType {
	/**
	 * identifier 
	 * should be lowercase
	 */

	static identifier = 'noType'

	/**
	 * validate
	 * fn to validate if a `value`
	 * is the same as the class type
	 */

	static validate(value){
		console.warn('Implement a validate method for type:' + this.identifier);
		return false
	}

	static toString(){
		return 'MomentumType ' + this.identifier
	}
}