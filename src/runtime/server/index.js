import MomentumServer from './MomentumServer';
import Path from 'path';

export default class ServerRuntime {
	constructor(instance, dirname){
		let rootPath = Path.join(dirname, '..');
		let config = require(Path.join(rootPath, 'momentum.json'));

		config.dirs = {
			app: Path.join(rootPath, 'app'),
			root: rootPath
		};

		/**
		 * TODO: Preflight check if all files
		 * are present
		*/

		this.config = config;
		let server = new MomentumServer(config);
		server.run();
	}
}