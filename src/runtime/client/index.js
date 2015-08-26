import MomentumData from '../../store/client/index';
import {} from 'setimmediate';
import Debug from 'debug';

export default class ClientRuntime {
	constructor(UserApplication){
		this.enableDebug();
		this.initializeTransports();
		this.initializeStores();

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

	initializeTransports(){
		this.socket = io();
		this.socket.on('connect_error', function(){
			console.log('connect_error', arguments)
		})
	}

	initializeStores(){
		this.data = new MomentumData({}, this.socket);
	}
}