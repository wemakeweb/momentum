import Debug from 'debug';
import MomentumRecord from './MomentumRecord';

/**
 * The socket message protocol
 * request struct: {
 *	id: <String>
 *	method: <String>
 *	args: <Array>
 * }
 * response struct: {
 *	id: <String>
 *	error: <String | false>
 *	response: <Any>
 * }
 *
 * id:	the Message id is reused between server and 
 * 		client to identifiy the message
 * 
 * Notice: the Message may time out
 */

let debug = Debug('momentum:messaging');

export default class Message {
	prefix = 'mm'
	version = '1'

	constructor(socket){
		this.socket = socket;
		this.generateIdentifiers();
	}

	generateIdentifiers(){
		this.namespace = [this.prefix, this.version].join('.');

		this.id = [
			this.namespace,
			Math.random().toString().substring(2,8),
			new Date().getTime().toString()
		].join('.');
	}

	request(method, args){
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
		
		this.socket.on(this.id, this.receive.bind(this));
		this.socket.emit(this.namespace, { id: this.id, method, args });

		debug('emit: %o args: %o', method, args);
		
		return this.promise;
	}

	stream(method, args, fn){
		this.fn = fn;
		this.socket.on(this.id, this.receiveStream.bind(this));
		this.socket.emit(this.namespace, { id: this.id, method, args });

		debug('stream: %o args: %o', method, args);
	}

	receiveStream(message){
		if(message.response.type){
			switch(message.response.type){
				case 'MomentumRecord':
					let record = new MomentumRecord(message.response.value, message.response.meta);
					this.fn(record);
				break

				default:
					this.fn(message.response);
				break;
			}
		}
	}

	receive(message){
		this.socket.off(this.id, this.receive.bind(this));
		
		if(message.error) {
			this.reject(message.error);
		} else {
			if(message.response.type){
				switch(message.response.type){
					case 'MomentumRecord':
						let record = new MomentumRecord(message.response.value, message.response.meta);
						this.resolve(record);
					break

					default:
						this.resolve(message.response);
					break;
				}
			}
		}
	}
}