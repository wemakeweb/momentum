import MomentumApp from './MomentumApp';
import MomentumComponent from './MomentumComponent';
import MomentumRouter from './MomentumRouter';
import MomentumType from './data/type/Types';
import MomentumRecord from './data/MomentumRecord';
import RethinkStore from './data/stores/RethinkStore';

let Momentum = {};
Momentum.App = MomentumApp;
Momentum.Component = MomentumComponent;
Momentum.Router = MomentumRouter;
Momentum.Type = MomentumType;
Momentum.Record = MomentumRecord;
Momentum.Stores = {
	RethinkStore
};

var globalNamespace;

if(typeof window !== 'undefined'){
	globalNamespace = window;
} else if(typeof global !== 'undefined'){
	globalNamespace = global; 
} else {
	throw new Error('Could not determine globalNamespace');
}

if(!globalNamespace.Momentum){
	globalNamespace.Momentum = Momentum;
} else {
	throw new Error('Momentum has already be initialized');
}

export default Momentum;