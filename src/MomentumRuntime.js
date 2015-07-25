//import config from '../momentum.json';
import * as UserApplication from '../app/index' 
import {isType, isClient} from 'src/utils';

class MomentumRuntime {
	constructor(){
		if(isClient){			
			if(UserApplication.App){
				this.instance = new UserApplication.App();
			} else if(UserApplication) {
				this.instance = new UserApplication();
			} else {
				throw new Error('Your Application was not found!');
			}

			this.initializeClient();
		}
		
	}
	
	initializeClient(){
		/*if(!config){
			throw new Error('No Momentum.json file found.');
		}*/

		this.render();
	}

	render(){
		let view = this.instance.renderToNode();

		if(!view){
			throw new Error('Your Application should render something');
		}

		if(isClient){
			document.body.appendChild(view);
			this.instance.trigger('attached');
		}
	}
}

new MomentumRuntime();