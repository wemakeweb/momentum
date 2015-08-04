import MomentumDriver from './MomentumDriver';
import MomentumRecord from '../MomentumRecord';
import r from 'rethinkdbdash';

export default class RethinkDB extends MomentumDriver {
	
	constructor(options){
		super(options);
		this.options = options;
		this.connection = r({
			db: options.database
		});
	}

	tableCreate(model){
		return this.connection.tableCreate(model.tableName)
			.run()
	}

	create(Model, data) {
		let record = new Model(data);

		return new Promise((resolve, reject) => {
			this.connection.table(Model.tableName)
				.insert(data)
				.catch((err) =>{
					reject(err);
				})
				.then(function(data){
					if(data.generated_keys){
						record._primaryKey = data.generated_keys[0];
					}

					resolve(record);
				})
		});
	}

	read(model, key) {
		return this.connection.table(model.bucket)
			.get(key)
			.run();
	}

	update(document, data, callback) {

	}

	destroy(model, key) {
		return this.connection.table(model.bucket)
			.get(key)
			.delete()
			.run();
	}

	findOne(model, spec, callback) {
		return this.connection.table(model.bucket)
			.getAll(spec.search, { index : spec.index })
			.limit(1)
			.run();
	}

	find(model, spec, callback) {
		return this.connection.table(model.bucket)
			.getAll(spec.search, { index : spec.index })
			.run();
	}
}