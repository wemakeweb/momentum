import Debug from 'debug';
import MomentumDriver from './MomentumDriver';
import MomentumMessage from '../Message';

export default class SocketDriver extends MomentumDriver {
	constructor(options){
		super(options)
		this.socket = options.socket;
	}

	tableCreate(Model){
		return new MomentumMessage(this.socket).request(
			'tableCreate',
			[Model.getIdentifier()]
		);
	}

	create(Model, record, query) {
		return new MomentumMessage(this.socket).request(
			'create',
			[Model.getIdentifier(), record, query]
		);
	}

	read(Model, key, query) {
		return new MomentumMessage(this.socket).request(
			'read',
			[Model.getIdentifier(), key, query]
		);
	}

	update(Model, record, query) {
		return new MomentumMessage(this.socket).request(
			'update',
			[Model.getIdentifier(), record, query]
		);
	}

	destroy(Model, key) {
		return new MomentumMessage(this.socket).request(
			'destroy',
			[Model.getIdentifier(), key]
		);
	}

	findOne(Model, spec, query) {
		return new MomentumMessage(this.socket).request(
			'findOne',
			[Model.getIdentifier(), spec, query]
		);
	}

	find(Model, spec, query) {
		return new MomentumMessage(this.socket).request(
			'find',
			[Model.getIdentifier(), spec, query]
		);
	}

	bind(modelIdentifier, query, fn){
		return new MomentumMessage(this.socket).stream(
			'bind',
			[modelIdentifier, query],
			fn
		);
	}	
}