import MomentumRuntime from './runtime/index';
import MomentumApp from './MomentumApp';
import MomentumComponent from './MomentumComponent';
import MomentumRouter from './MomentumRouter';
import MomentumType from './data/type/Types';
import MomentumRecord from './data/MomentumRecord';
import RethinkStore from './data/stores/RethinkStore';
import * as Assets from './MomentumAssets';
import Debug from 'debug';

//tmp
import { default as ReactMock } from './ReactMock' 

let debug = Debug('momentum');

var Momentum = {
	App: MomentumApp,
	Component: MomentumComponent,
	Router: MomentumRouter,
	Type: MomentumType,
	Record: MomentumRecord,
	Stores: {
		RethinkStore
	},

	isClient: false,
	dev: true
};

var globalNamespace;

if(typeof window !== 'undefined'){
	globalNamespace = window;
	Momentum.isClient = true;
	debug('is client');
} else if(typeof global !== 'undefined'){
	globalNamespace = global;
	debug('is server'); 
} else {
	throw new Error('Could not determine globalNamespace');
}

if(!globalNamespace.Momentum){
	globalNamespace.Momentum = Momentum;
	globalNamespace.React = ReactMock;
	debug('globalizing momentum');
} else {
	throw new Error('Momentum has already be initialized');
}

if(!Momentum.Runtime){
	Momentum.Runtime = new MomentumRuntime();
} else {
	throw new Error('A Momentum.Runtime is already running in this context');
}

export default Momentum;