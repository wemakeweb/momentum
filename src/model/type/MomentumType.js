class MomentumType {
	/**
	 * identifier 
	 * should be lowercase
	 */

	identifier = 'noType'

	/**
	 * validate
	 * fn to validate if a `value`
	 * is the same as the class type
	 */

	validate(value){
		console.warn('Implement a validate method for type:' + this.identifier);
		return false
	}

	toString(){
		return 'MomentumType ' + this.identifier
	}
}