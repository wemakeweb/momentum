/*
 * base class where all the drivers
 * should inherit from
 */

export default class MomentumDriver {
	constructor(options){
		this.options = options;
	}

	tableCreate(){

	}

	create(document, data) {

	}

	read(model, key) {

	}

	update(document, data, callback) {

	}

	destroy(model, key) {

	}

	findOne(model, spec, callback) {

	}

	find(model, spec, callback) {

	}
}