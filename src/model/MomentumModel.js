
/**
 * abstract class for all momentum
 * models
 */

export default class MomentumModel {	
	/**
	 * convenient methods all model
	 * implementation should implement
	 */

	/**
	 * creates a record
	 */

	create(){

	}

	/**
	 * destorys or deletes a
	 * record
	 */

	destroy(){

	}

	/**
	 * alias method for destroy
	 */

	delete(){
		return this.destroy.apply(this, arguments);
	}

	/**
	 * gets a record by a given `_id`
	 */

	get(){

	}

	/**
	 * finds records by given `criteria`
	 */

	find(){

	}

	/**
	 * finds the first record which matches
	 * the passed `criteria`
	 */

	findOne(){

	}
}