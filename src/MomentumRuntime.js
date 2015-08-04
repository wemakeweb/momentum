import Momentum from './Momentum';
import * as Assets from './MomentumAssets';
import {isType, isClient} from './utils';
import * as UserApplication from '../app/index' 
import ClientRuntime from './runtime/client/index';

export default class MomentumRuntime {
	constructor(){
		
		this.findUserApplication();

		if(isClient){			
			this.runtime = new ClientRuntime(this.app);
		} else {
			let ServerRuntime = require('./runtime/server');
			this.runtime = new ServerRuntime(this.app, __dirname);
		}

		return this.runtime;
	}
	
	findUserApplication(){
		if(UserApplication.App){
			this.app = UserApplication.App;
		} else if(UserApplication) {
			this.app = UserApplication;
		} else {
			throw new Error('Your Application was not found!');
		}
	}
}

if(!Momentum.Runtime){
	Momentum.Runtime = new MomentumRuntime();
} else {
	throw new Error('A Momentum.Runtime is already running in this context');
}