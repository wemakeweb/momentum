import Momentum from '../src/Momentum';
import { default as React } from '../src/ReactMock' 
import Clock from './components/clock/index';

export class App extends Momentum.App {
	routes = {
		'/welcome': Clock
	}

	click (){
		console.log('click',this)
	}

	render(){
		return ( 
			<div class="row" onclick={this.click}>
				<div class="col-md-6">
					<Momentum.Router mountPoint={this.mountPoint} routes={this.routes} />
				</div>
				<a href="/welcome">Msks</a>
				<a href="/noMatch">noMtach</a>
				<div class="col-md-6">
					<Clock id="76b53d98-702e-4e95-a968-660c61b3ea3d"/>
				</div>
			</div>
		);
	}
}