import MomentumApp from '../src/MomentumApp';
import MomentumRouter from '../src/MomentumRouter';

function Welcome (argument) {
	// body...
}

Welcome.prototype.render = function() {
	return `<div> Welcome View </div>`;
};

export class App extends MomentumApp {
	routes = {
		'/welcome': Welcome
	}

	constructor(){
		super();
		this.router = new MomentumRouter(this.mountPoint, this.routes);
	}

	render(){
		return `<div class="row">
					<div class="col-md-6">
						${ this.router.render() }
					</div>
					<a href="/welcome">Match</a>
					<a href="/noMatch">noMtach</a>
				</div>`;
	}
}