import Debug from 'debug';
import Message from '../Message';

let debug = Debug('momentum:messaging');

export default class MessageServer {
	prefix = 'mm'
	version = '1'

	listeners = {}
	streamListeners = {}
	types = {}

	constructor(socket){
		this.socket = socket;
		this.namespace = [this.prefix, this.version].join('.');
		this.bind();
	}

	listen(method, fn){
		this.listeners[method] = fn;
		return this;
	}

	streamListener(method, fn){
		this.streamListeners[method] = fn;
		return this;
	}

	bind(){
		this.socket.on('connection', (socket) => {
			socket.on(this.namespace, this.receiveListener.bind(this));
		});

		debug('bind');
	}

	receiveListener(data){
		let {id, method, args} = data;
		
		if(method in this.listeners){
			debug('method call %o with %o', method, args);

			args = args.map((arg) => {
				if(!arg.type){
					return arg;
				}

				if(!(arg.type in this.types)){
					throw new Error('unknown type `' + arg.type + '`');
				}

				let Type = this.types[arg.type];
				return Type.fromDataObj(arg);
			});	

			let promise = this.listeners[method](args);

			if(!promise){
				throw new Error(`Method \`${method}\` returned no promise`);

				return this.socket.emit(id, {
					error: 'Method call failed',
					response: {}
				})
			}

			promise.then((record) => {
				this.socket.emit(id, {
					error: false,
					response: record.toJSON()
				});

				debug('sending %o response:%o', id, record.toJSON());
			}).catch((err) => {
				this.socket.emit(id, {
					error: err,
					response: {}
				});

				debug('sending %o error:%o', id, err);
			});

		} else if(method in this.streamListeners){
			let callback = (record) => {
				return this.socket.emit(id, {
					error: false,
					response: record.toJSON()
				});
			};

			debug('method call %o with %o', method, args);

			args.push(callback);

			this.streamListeners[method](args);
		} else {
			throw new Error('undefined method call from client');
		}
	}

	registerType(Type){
		this.types[Type.name] = Type;
	}
}


	