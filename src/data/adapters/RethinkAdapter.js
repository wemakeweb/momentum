import MomentumAdapter from './MomentumAdapter';
import Record from '../MomentumRecord';
import r from 'rethinkdbdash';
import Debug from 'debug';

let debug = Debug('momentum:rethinkdbadapter');


export default class RethinkDB extends MomentumAdapter {
	
	constructor(options){
		this.connection = r({
			db: options.database
		});
	}

	tableCreate(Model){
		return this.connection.tableCreate(Model.tableName)
			.run()
	}

	create(Model, record, query) {
		return new Promise((resolve, reject) => {
			this.connection.table(Model.tableName)
				.insert(record)
				.catch((err) =>{
					reject(err);
				})
				.then(function(data){
					debug('Created #%s <%s>', data.generated_keys, Model.tableName);
					if(data.generated_keys){
						record.setPrimaryKey(data.generated_keys[0]);
						query.criteria = {
							id: data.generated_keys[0]
						}
						record.setMeta({ query })
					}
					
					resolve(record);
				})
		});
	}

	read(Model, key, query) {
		return new Promise((resolve, reject) => {
			var cursor = this.connection.table(Model.tableName)
				.get(key)

			return cursor.run().catch((err) =>{
				reject(err);
			}).then(function(data){
				debug('Read #%s <%s>', key, Model.tableName);
				let id = data.id;
				delete data.id;
				let record = new Record(data, {
					primaryKey: id,
					query: query
				});

				resolve(record);
			});
		});
	}

	update(Model, key, updates, record) {
		return new Promise((resolve, reject) => {
			var cursor = this.connection.table(Model.tableName)
				.get(key)
				.update(updates)

			return cursor.run().catch((err) =>{
				reject(err);
			}).then(function(data){
				if(data.generated_keys){
					record.setPrimaryKey(data.generated_keys[0]);
					query.criteria = {
						id: data.generated_keys[0]
					}
					record.setMeta({ query })
				}

				resolve(record);
			});
		});
	}

	destroy(Model, key) {
		return this.connection.table(Model.tableName)
			.get(key)
			.delete()
			.run()
			.then(function(){
				debug('Delete #%s <%s>', key, Model.tableName);
			})
	}

	findOne(Model, spec, callback) {
		return this.connection.table(Model.tableName)
			.getAll(spec.search, { index : spec.index })
			.limit(1)
			.run();
	}

	find(Model, spec, callback) {
		return this.connection.table(Model.tableName)
			.getAll(spec.search, { index : spec.index })
			.run();
	}

	bind(Model, query, callback){
		let binder = function(err, data){
			if(!err){
				let primaryKey = data.new_val.id;
				delete data.new_val.id;
				let record = new Record(data.new_val, {
					primaryKey
				})

				callback(record);
			}
		};

		return new Promise((resolve, reject) => {
			this.connection.table(Model.tableName)
				.get(query.criteria.id)
				.changes()
				.then((cursor) => {
					resolve(cursor);
					cursor.each(binder)
				})
				.catch(reject)
		});
	}
}