import MomentumApp from '../src/MomentumApp';
import MomentumRouter from '../src/MomentumRouter';
import { default as React } from '../src/ReactMock' 
import Clock from './Clock';

export class App extends MomentumApp {
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
					<MomentumRouter mountPoint={this.mountPoint} routes={this.routes} />
				</div>
				<a href="/welcome">Msks</a>
				<a href="/noMatch">noMtach</a>
				<div class="col-md-6">
					<Clock />
				</div>
			</div>

		);
	}
}