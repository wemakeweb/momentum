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
		let representation = this.instance.render();

		if(!representation){
			throw new Error('Your Application should render something');
		}

		if(isClient){
			/**
			 * in case its not a node
			 */
			if(isType(String, representation)){
				let div = document.createElement('div');
				div.innerHTML = String(representation);
				representation = div;
			}

			document.body.appendChild(representation);
		}
	}
}

new MomentumRuntime();