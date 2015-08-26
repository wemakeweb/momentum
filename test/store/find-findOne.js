import TestModel from './model';
import assert from 'assert';

let i = 0;

Promise.all([
	TestModel.create({
		titel: 'Hello World',
		content: (++i).toString()
	}),

	TestModel.create({
		titel: 'Hello World',
		content: (++i).toString()
	}),

	TestModel.create({
		titel: 'Hello World',
		content: (++i).toString()
	})
]).then(function(){
	return TestModel.find({titel: 'Hello World'});
}).then(function(records){
	assert(toString.call(records) === "[object Array]");
	assert(records.length > 0);
	assert(records.meta);
	assert(toString.call(records.meta) === "[object Object]");
	assert(records.meta.query);
	
	return TestModel.findOne({titel: 'Hello World'});
}).then(function(record){
	assert(record instanceof Momentum.Record);
	assert(record.meta);
	assert(record.meta.primaryKey);
}).then(() => {
	console.log('All Tests passed');
}).catch(function (err) {
	console.log(err);
	if(err.stack) console.log(err.stack)
});