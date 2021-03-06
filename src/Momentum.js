import MomentumRuntime from './runtime/index';
import MomentumApp from './component/MomentumApp';
import MomentumComponent from './component/MomentumComponent';
import MomentumRouter from './component/MomentumRouter';
import MomentumType from './store/type/Types';
import MomentumRecord from './store/MomentumRecord';
import RethinkStore from './store/stores/RethinkStore';
import * as Assets from './component/MomentumAssets';
import createElement from './component/createElement';
import Debug from 'debug';

let debug = Debug('momentum:runtime');

var Momentum = {
	createElement: createElement,
	App: MomentumApp,
	Component: MomentumComponent,
	Router: MomentumRouter,
	Type: MomentumType,
	Record: MomentumRecord,
	Stores: {
		RethinkStore
	},

	isClient: false,
	dev: true,
	env: 'development'
};


/**
 * determine what the global namespace is
 * `window` -> we are in a browser
 * `global` -> we are in a nodejs environment
 */

var globalNamespace;

if(typeof window !== 'undefined'){
	globalNamespace = window;
	Momentum.isClient = true;
} else if(typeof global !== 'undefined'){
	globalNamespace = global;
} else {
	throw new Error('Could not determine globalNamespace');
}

debug('running as %o', Momentum.isClient ? 'client': 'server');

/**
 * gloablize momentum once per context
 */

if(!globalNamespace.Momentum){
	globalNamespace.Momentum = Momentum;
	globalNamespace.MomentumjsElementCreator = createElement;
	globalNamespace.React = { createElement: createElement };
	debug('globalizing momentum');
} else {
	throw new Error('Momentum has already be initialized');
}

/**
 * if this is the first require of the file
 * start the runtime and assign to the global
 * space as singleton
 */

if(!Momentum.Runtime){
	Momentum.Runtime = new MomentumRuntime();
} else {
	throw new Error('A Momentum.Runtime is already running in this context');
}

export default Momentum;