import _ from './src/MomentumRuntime';
import ClockModel from './app/models/ClockModel';
import ClockComp from './app/components/clock/index';

/*let component = new ClockComp({
	id: '76b53d98-702e-4e95-a968-660c61b3ea3d'
});*/

/*ClockModel.create({
	hour: 10,
	minutes: 10
}).then(function(record){
	console.log(record.primaryKey)
});*/

ClockModel.get('76b53d98-702e-4e95-a968-660c61b3ea3d').then((record) => {
	setInterval(() => {
		let time = new Date()
		ClockModel.update(record, {
			minutes: time.getMinutes(),
			hour: time.getHours(),
			seconds: time.getSeconds()
		}).catch((err) => {
			console.log(err)
		})
	}, 1000);
});