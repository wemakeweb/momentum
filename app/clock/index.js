import Momentum from '../../src/Momentum';
import { default as React } from '../../src/ReactMock' 

@assets({
	styles:['style.css'],
	scripts: ['test.js']
})

export default class Clock extends Momentum.View {
	state = {
		time: this.getClock()
	}

	onAttached(){
		this.update();
	}

	getClock(){
		let now = new Date();
		
		return [
			('0' + now.getHours()).slice(-2),
			('0' + now.getMinutes()).slice(-2),
			('0' + now.getSeconds()).slice(-2)
		].join(':');
	}

	update(){
		this.setState({ time: this.getClock() }); 
		setTimeout(this.update.bind(this), 1000);
	}

	render(){
		return (<div>{this.state.time} Uhr</div>); 
	}
}