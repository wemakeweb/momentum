import SocketDriver from '../drivers/SocketDriver';

export default class MomentumData {
	constructor(config, socket){
		this.driver = new SocketDriver({ socket });
	}
}