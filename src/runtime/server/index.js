import MomentumServer from './MomentumServer';
import Path from 'path';
import MomentumData from '../../data/server/';
import io from 'socket.io';

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
		this.initializeTransports();
		this.initializeData();
	}

	checkEnvironment(){
		//check if all needed app folders are present etc
	}

	initializeTransports(){
		this.http = new MomentumServer(this.config);
		this.socket = io(this.http.rawHttp);
		this.http.run();
	}

	initializeData(){
		this.data = new MomentumData(this.config, this.socket);
	}
}