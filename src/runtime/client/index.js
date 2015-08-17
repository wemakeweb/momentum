import MomentumData from '../../data/client/index';
import {} from 'setimmediate';
import Debug from 'debug';

export default class ClientRuntime {
	constructor(UserApplication){
		this.enableDebug();
		
		this.socket = io();
		this.socket.on('connect_error', function(){
			console.log('connect_error', arguments)
		})

		this.data = new MomentumData({}, this.socket);

		setImmediate(() => {
			this.instance = new UserApplication();
			this.render();
		});
	}

	enableDebug(){
		window.momentumDebug = Debug;
		momentumDebug.enable('momentum:*');
	}

	render(){
		let view = this.instance.renderToNode(document.body);
		this.instance.trigger('attached');
	}
}