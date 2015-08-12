/*
 * base class where all the drivers
 * should inherit from
 */

export default class MomentumDriver {
	constructor(options){
		this.options = options;
	}

	tableCreate(Model){

	}

	create(Model, record, query) {

	}

	read(Model, key, query) {

	}

	update(Model, record, query) {

	}

	destroy(Model, key) {

	}

	findOne(Model, spec, query) {

	}

	find(Model, spec, query) {

	}

	bind(query, fn){

	}
}