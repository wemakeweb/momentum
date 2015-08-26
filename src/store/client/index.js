import SocketAdapter from '../adapters/SocketAdapter';

export default class MomentumData {
	constructor(config, socket){
		this.adapter = new SocketAdapter({ socket });
	}
}