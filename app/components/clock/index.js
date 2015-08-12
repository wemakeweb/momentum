import { default as React } from '../../../src/ReactMock' 
import ClockModel from '../../models/ClockModel';

@assets({
	styles:['style.css'],
	scripts: ['test.js']
})

export default class Clock extends Momentum.Component {
	state = {
		time: this.getClock()
	}

	storeSelect(){
		return ClockModel.get(this.attrs.id);
	}

	storeDidUpdate(record){
		this.setState({
			time: record.hour + ':' + record.minutes + ':' + record.seconds
		});
	}

	onAttached(){
		//this.update();
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