import Debug from 'debug';
import Record from '../MomentumRecord';

let debug = Debug('momentum:store');

/**
 * abstract class for all momentum
 * models
 */

export default class MomentumStore {

	static validateWithSchema(record){
		for(let key in record){
			if(!(key in this.schema)){
				return createPromiseAndReject(`${key} is not a valid field in ${this.name}´s schema`);
			}

			let field = this.schema[key];
			let valid = field.validate(record[key]);
			
			debug('Validating %o against type %o -> %o', record[key], field.toString(), valid? 'OK' : 'Fail' );

			if(!valid){
				return createPromiseAndReject(`${record[key]} is not valid for type: ${field.toString()}`);
			}
		}

		return true;
	}
	

	/**
	 * schema
	 * the schema the model data must conform
	 * example:
	 * 	schema = {
	 *		title: Momentum.Type.string,
	 *		content: Momentum.Type.string
	 *	}
	*/

	static schema = {}

	/**
	 * method to initialize the model with
	 * the driver, gets called once when the 
	 * momentum runtime boots
	 */

	/**
	 * holds a reference to the  
	 * database driver
	 */
	
	static initialize(Model, driver){
		if(!Model.name || Model.name === ''){
			throw new Error('Momentum.Model please specify a model name');
		}

		for(let field in this.schema){
			if(!this.schema[field] || !this.schema[field].validate){
				throw new Error('Unknown Type for ' + Model.name + '.' + field);
			}
		}

		/*if(!Model.tableName || Model.tableName === ''){
			Model.tableName = Model.name;
		}*/

		/**
		 * check if the model table already exists 
		 * if not creates it
		 */

		driver.tableCreate(Model).then(function(){
			console.log('Table: %s was created', model.tableName);
		})
		.catch(function() {
			//throws error if table already exists
		})
	}


	/**
	 * convenient methods all model
	 * implementation should implement
	 */

	/**
	 * creates a record
	 */

	static create(data){
		let query = new Query({
			action: Query.CREATE,
			model: this.getIdentifier()
		});
		let record = new Record(data);
		let validation = this.validateWithSchema(record);
		
		if(validation === true){
			return Momentum.Runtime.data.adapter.create(this, record, query);
		} else {
			return validation;
		}
	}

	/**
	 * generates a new record with the old
	 * record as base and the to update 
	 * properties on top of it 
	 */

	static update(oldRecord, propsToUpdate){
		let newRecord = oldRecord.update(propsToUpdate);
		let validation = this.validateWithSchema(newRecord);
		
		if(validation === true){
			return new Promise((resolve, reject) => {
				Momentum.Runtime.data.adapter.update(this, oldRecord.primaryKey, propsToUpdate, newRecord)
				.then(() => {
					resolve(newRecord);
				})
				.catch((err) => {
					reject(err);
				});
			});
		} else {
			return validation;
		}
	}

	/**
	 * destorys or deletes a
	 * record
	 */

	static destroy(id){
		return Momentum.Runtime.data.adapter.destroy(this, id);
	}

	/**
	 * alias method for destroy
	 */

	static delete(id){
		return this.destroy(id);
	}

	/**
	 * gets a record by a given `primaryKey`
	 */

	static get(primaryKey){
		let query = new Query({
			action: Query.READ,
			model: this.getIdentifier(),
			criteria: {
				id: primaryKey
			}
		});

		if(!primaryKey){
			return createPromiseAndReject('No value was passed to Model.get');
		}

		return Momentum.Runtime.data.adapter.read(this, primaryKey, query);
	}

	/**
	 * finds records by given `criteria`
	 */

	static find(criteria){
		let query = new Query({
			action: Query.READ,
			model: this.getIdentifier(),
			criteria: {
				find: criteria
			}
		});

		return Momentum.Runtime.data.adapter.find(this, criteria, query);	
	}

	/**
	 * finds the first record which matches
	 * the passed `criteria`
	 */

	static findOne(criteria){
		let query = new Query({
			action: Query.READ,
			model: this.getIdentifier(),
			criteria: {
				find: criteria,
				limit: 1
			}
		});

		return Momentum.Runtime.data.adapter.findOne(this, criteria, query)
	}

	static bind(Model, query, fn){
		return Momentum.Runtime.data.adapter.bind(Model, query, fn);
	}

	static getIdentifier(){
		return this.tableName;
	}
}


function createPromiseAndReject(error){
	return new Promise((resolve, reject) => {
        reject(error);
    })
}

function createPromiseAndResolve(){
	return new Promise((resolve, reject) => {
        resolve();
    })
}


class Query {
	constructor(config){
		this.action = config.action;
		this.criteria = config.criteria;
		this.model = config.model;
	}
}

Query.READ = 'read';
Query.CREATE = 'create';
Query.DELETE = 'delete';