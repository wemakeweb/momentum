import MomentumApp from '../src/MomentumApp';
import MomentumRouter from '../src/MomentumRouter';
import { default as React } from '../src/ReactMock' 

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

	click (){
		console.log('hiphophorray')
	}

	render(){
		return ( 
			<div class="row" onclick={this.click.bind(this)}>
				<div class="col-md-6">
					Hey Bitches
				</div>
				<a href="/welcome">Msks</a>
				<a href="/noMatch">noMtach</a>
			</div>
		);
	}
}