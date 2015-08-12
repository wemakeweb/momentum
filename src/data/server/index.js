import Path from 'path';
import utils from './utils';
import MessageServer from './MessageServer';

//drivers
import RethinkDriver from '../drivers/RethinkDriver';

let drivers = {
	RethinkDriver
};

export default class MomentumData {
	identifierMap = {}


	constructor(config, socket){
		this.config = config;
		this.socket = socket;

		if(!this.config.database){
			throw new Error('Please specify your database settings in momentum.json');
		}

		if(!this.config.database.driver){
			throw new Error('Please specify a database driver in momentum.json');
		}

		if(!this.config.database.tableName){
			throw new Error('Please specify a tableName in momentum.json');
		}

		if(!(this.config.database.driver in drivers)){
			throw new Error('Unknown Database Adapter: ' + this.config.database.adapter);
		}

		this.connectToDatabase();
		let models = this.getModels();
		this.initializeModels(models);
		this.connectToClient();
	}

	connectToDatabase(){
		let Driver = drivers[this.config.database.driver];
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
			this.identifierMap[Model.getIdentifier()] = Model;
		}
	}

	connectToClient(){
		let messageServer = new MessageServer(this.socket);
		let identifierMap = this.identifierMap;
		let driver = this.driver;

		function bind(method) {
			return function(args){
				let modelIdentifier = args[0];
				let Model = identifierMap[modelIdentifier];
				args[0] = Model;

				return driver[method](...args);
			}
		}

		messageServer
			.listen('create', bind('create'))
			.listen('read', bind('read'))
			.listen('update', bind('update'))
			.listen('destroy', bind('destroy'))
			.listen('findOne', bind('findOne'))
			.listen('find', bind('find'))

		messageServer.streamListener('bind', bind('bind'))
	}
}