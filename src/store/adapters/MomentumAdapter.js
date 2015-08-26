/*
 * this is basically an interface for 
 * all adpater classes
 */

export default class MomentumAdapter {
	tableCreate(Model){ }

	tableDrop(Model){ }

	create(Model, record, query) { }

	read(Model, key, query) { }

	update(Model, record, query) { }

	destroy(Model, key) { }

	findOne(Model, spec, query) { }

	find(Model, spec, query) { }

	bind(query, fn){ }

	unbind(query, fn){ }
};