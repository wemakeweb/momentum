//import config from '../momentum.json';
import * as MomentumAssets from './MomentumAssets';
import {isType, isClient} from './utils';
import * as UserApplication from '../app/index' 
import ClientRuntime from './runtime/client/index';

class MomentumRuntime {
	constructor(){
		this.findApplication();

		if(isClient){			
			this.runtime = new ClientRuntime(this.app);
		} else {
			let ServerRuntime = require('./runtime/server');
			this.runtime = new ServerRuntime(this.app, __dirname);
		}
	}
	
	findApplication(){
		if(UserApplication.App){
			this.app = UserApplication.App;
		} else if(UserApplication) {
			this.app = UserApplication;
		} else {
			throw new Error('Your Application was not found!');
		}
	}
}

new MomentumRuntime();