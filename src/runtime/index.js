import {isType, isClient} from '../utils';
//import * as UserApplication from '/index' 
import ClientRuntime from './client/index';

export default function(){
	let runtime;
	let app;
	let root;

	if(isClient){
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

		//try{
			app = require(appath);
		/*} catch(err){
			if(err.code === 'MODULE_NOT_FOUND'){
				throw new Error('We couldnt find your application at: ' + appath);
			} else {
				throw err;
			}
		}*/

		let ServerRuntime = require('./server');
		runtime = new ServerRuntime(app, root);
	}

	return runtime;
};