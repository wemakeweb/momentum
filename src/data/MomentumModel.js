
/**
 * abstract class for all momentum
 * models
 */

export default class MomentumModel {
	_primaryKey = null

	constructor(obj){
		for(let key in obj){
			this[key] = obj;
		}
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

	schema = {}

	/**
	 * specify the table here, if no table is
	 * specifed the model `name` is used
	 */
	
	tableName = ''

	/**
	 * specify the database here, if no database is
	 * specifed the default database is used
	 */

	database = ''

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

		/*if(!Model.tableName || Model.tableName === ''){
			Model.tableName = Model.name;
		}*/

		/**
		 * check if the model table allready exists 
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
		for(let key in data){
			if(!(key in this.schema)){
				return createPromiseAndReject(`${key}  is not a valid field in ${this.name} schema`);
			}

			let field = this.schema[key];
			let valid = field.validate(data[key]);

			if(!valid){
				return createPromiseAndReject(`${data[key]} is not valid for type: ${field.toString()}`);
			}
		}

		return Momentum.Runtime.data.driver.create(this, data);
	}

	/**
	 * destorys or deletes a
	 * record
	 */

	static destroy(){

	}

	/**
	 * alias method for destroy
	 */

	static delete(){
		return this.destroy.apply(this, arguments);
	}

	/**
	 * gets a record by a given `_id`
	 */

	static get(){

	}

	/**
	 * finds records by given `criteria`
	 */

	static find(){

	}

	/**
	 * finds the first record which matches
	 * the passed `criteria`
	 */

	static findOne(){

	}
}


function createPromiseAndReject(error){
	return new Promise((resolve, reject) => {
        reject(error);
    })
}