import MomentumApp from '../src/MomentumApp';
import MomentumRouter from '../src/MomentumRouter';
import { default as React } from '../src/ReactMock' 
import Countdown from './Countdown';

export class App extends MomentumApp {
	routes = {
		'/welcome': Countdown
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
					<Countdown until={new Date().getTime() + 1000*60} />
				</div>
			</div>

		);
	}
}