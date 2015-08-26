import Debug from 'debug';
import MomentumAdapter from './MomentumAdapter';
import MomentumMessage from '../MessageClient';

export default class SocketAdapter extends MomentumAdapter {
	constructor(options){
		super();
		this.connection = options.socket;
	}

	tableCreate(Model){
		return new MomentumMessage(this.connection).request(
			'tableCreate',
			[Model.getIdentifier()]
		);
	}

	tableDrop(Model){
		return new MomentumMessage(this.connection).request(
			'tableDrop',
			[Model.getIdentifier()]
		);
	}

	create(Model, record, query) {
		return new MomentumMessage(this.connection).request(
			'create',
			[Model.getIdentifier(), record, query]
		);
	}

	read(Model, key, query) {
		return new MomentumMessage(this.connection).request(
			'read',
			[Model.getIdentifier(), key, query]
		);
	}

	update(Model, record, query) {
		return new MomentumMessage(this.connection).request(
			'update',
			[Model.getIdentifier(), record, query]
		);
	}

	destroy(Model, key) {
		return new MomentumMessage(this.connection).request(
			'destroy',
			[Model.getIdentifier(), key]
		);
	}

	findOne(Model, spec, query) {
		return new MomentumMessage(this.connection).request(
			'findOne',
			[Model.getIdentifier(), spec, query]
		);
	}

	find(Model, spec, query) {
		return new MomentumMessage(this.connection).request(
			'find',
			[Model.getIdentifier(), spec, query]
		);
	}

	bind(modelIdentifier, query, fn){
		return new MomentumMessage(this.connection).stream(
			'bind',
			[modelIdentifier, query],
			fn
		);
	}	
}