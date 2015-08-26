import _ from './src/MomentumRuntime';
import TestModel from './app/models/TestModel';
import assert from 'assert';

let record1;
let record2;
let record3;

TestModel.create({
	titel: 'Hello World',
	content: '1'
}).then(function(record){
	let id = record.primaryKey;
	record1 = record;
	return TestModel.get(id);
}).then(function(record){
	record2 = record;
	assert(record1.primaryKey === record.primaryKey);
	assert(record1.titel === record2.titel);
	assert(record1.content === record2.content);

	return TestModel.update(record, {
		titel: 'new Title'
	});
}).then(function(record){
	record3 = record;

	assert(record2.primaryKey !== record3.primaryKey);
	assert(record2.titel !== record3.titel);
	assert(record2.content === record3.content);
}).then(() => {
	console.log('All Tests passed');
}).catch(function (err) {
	console.log(err);
	if(err.stack) console.log(err.stack)
});