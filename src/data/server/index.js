import Path from 'path';
import utils from './utils';

//drivers
import rethinkdb from '../drivers/rethinkdb';

let drivers = {
	rethinkdb
};

export default class MomentumData {
	constructor(config){
		this.config = config;

		if(!this.config.database){
			throw new Error('Please specify your database settings in momentum.json');
		}

		if(!this.config.database.adapter){
			throw new Error('Please specify a database adapter in momentum.json');
		}

		if(!this.config.database.tableName){
			throw new Error('Please specify a tableName in momentum.json');
		}

		if(!(this.config.database.adapter in drivers)){
			throw new Error('Unknown Database Adapter: ' + this.config.database.adapter);
		}

		this.connect();
		let models = this.getModels();
		this.initializeModels(models);
	}

	connect(){
		let Driver = drivers[this.config.database.adapter];
		this.driver = new Driver(this.config.database);
	}

	getModels(){
		let path = Path.join(this.config.dirs.app, 'models');
		let files = utils.readdirRecursiveSync(path);
		let models = {};

		files.forEach((item) => {
			models[item.name] = require(item.path);
		})

		return models;
	}

	initializeModels(models){
		let readyModels = {};

		for(let modelName in models){
			let Model = models[modelName];
			Model.initialize(Model, this.driver);
		}
	}
}