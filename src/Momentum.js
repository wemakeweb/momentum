import MomentumRuntime from './runtime/index';
import MomentumApp from './MomentumApp';
import MomentumComponent from './MomentumComponent';
import MomentumRouter from './MomentumRouter';
import MomentumType from './data/type/Types';
import MomentumRecord from './data/MomentumRecord';
import RethinkStore from './data/stores/RethinkStore';
import * as Assets from './MomentumAssets';

//tmp
import { default as ReactMock } from './ReactMock' 


var Momentum = {
	App: MomentumApp,
	Component: MomentumComponent,
	Router: MomentumRouter,
	Type: MomentumType,
	Record: MomentumRecord,
	Stores: {
		RethinkStore
	},

	isClient: false
};

var globalNamespace;

if(typeof window !== 'undefined'){
	globalNamespace = window;
	Momentum.isClient = true;
} else if(typeof global !== 'undefined'){
	globalNamespace = global; 
} else {
	throw new Error('Could not determine globalNamespace');
}

if(!globalNamespace.Momentum){
	globalNamespace.Momentum = Momentum;
	globalNamespace.React = ReactMock;
} else {
	throw new Error('Momentum has already be initialized');
}

if(!Momentum.Runtime){
	Momentum.Runtime = new MomentumRuntime();
} else {
	throw new Error('A Momentum.Runtime is already running in this context');
}

export default Momentum;