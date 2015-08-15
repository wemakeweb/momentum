import {isType, isClient} from '../utils';
import ClientRuntime from './client/index';

/**
 * this tricks the transformer
 * to skip the require call 
 * and only execute at
 * runtime
 */

function f(mod){
	return require(mod);
}

export default function(){
	let runtime;
	let app;
	let root;

	if(isClient){
		/**
		 * this require call should only be executed
		 * by the jspm /systemjs require
		 */
		let UserApplication = require('index');

		if(UserApplication.App){
			app = UserApplication.App;
		} else if(UserApplication) {
			app = UserApplication;
		} else {
			throw new Error('Your Application was not found!');
		}			
		runtime = new ClientRuntime(app);

	} else {
		root = process.cwd();
		let appath = root + '/index.js';
		app = f(appath);
		let ServerRuntime = f('./server/index');
		runtime = new ServerRuntime(app, root);
	}

	return runtime;
};