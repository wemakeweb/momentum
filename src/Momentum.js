import MomentumApp from './MomentumApp';
import MomentumView from './MomentumView';
import MomentumRouter from './MomentumRouter';
import MomentumModel from './data/MomentumModel';
import MomentumType from './data/type/Types';

let Momentum = {};
Momentum.App = MomentumApp;
Momentum.View = MomentumView;
Momentum.Router = MomentumRouter;
Momentum.Model = MomentumModel;
Momentum.Type = MomentumType;

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