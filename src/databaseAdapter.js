import r from 'rethinkdbdash';

export default class DatabaseAdapter{

	constructor(config){
		this.config = config;
	}

	*initialize(){
		this.connection = r({
			db: this.config.tableName
		});

		return this.connection;
	}
}