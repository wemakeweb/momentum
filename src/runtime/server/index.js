import MomentumServer from './MomentumServer';
import Path from 'path';
import MomentumData from '../../data/server/';

export default class ServerRuntime {
	constructor(instance, dirname){
		let rootPath = Path.join(dirname, '..');
		let config = require(Path.join(rootPath, 'momentum.json'));

		config.dirs = {
			app: Path.join(rootPath, 'app'),
			root: rootPath
		};

		this.config = config;

		this.checkEnvironment();
		this.initializeData();
		this.initializeHttp();
	}

	checkEnvironment(){
		//check if all needed app folders are present etc

	}

	initializeHttp(){
		this.server = new MomentumServer(this.config);
		this.server.run();
	}

	initializeData(){
		this.data = new MomentumData(this.config);
	}
}