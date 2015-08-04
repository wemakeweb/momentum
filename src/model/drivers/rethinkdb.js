import MomentumDriver from './MomentumDriver';
import r from 'rethinkdbdash';


export default RethinkDB extends MomentumDriver {
	
	constructor(){
		this.connection = r({
			db: this.config.tableName
		});
	}

	create(document, data) {
		return this.connection.table(document.model.bucket)
			.insert(data);
	},

	read(model, key) {
		return this.connection.table(model.bucket)
			.get(key);
	},

	update(document, data, callback) {

	},

	destroy(model, key) {
		return this.connection.table(model.bucket)
			.get(key)
			.delete();
	},

	findOne : function findOne(model, spec, callback) {
		return this.connection.table(model.bucket)
			.getAll(spec.search, { index : spec.index })
			.limit(1);
	},

	find : function find(model, spec, callback) {
		return this.connection.table(model.bucket)
			.getAll(spec.search, { index : spec.index });
	}
}