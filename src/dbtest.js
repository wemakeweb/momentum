import r from 'rethinkdbdash';
import co from 'co';
import React from 'react';

import config from '../momentum.json';
import DatabaseAdapter from './databaseAdapter';
import HttpServer from './http';

import UserApplication from '../app/site';

class Momentum {
	constructor(){
		co(this.initialize.bind(this)).catch(this.onerror);
	}
	
	*initialize(){
		if(!config){
			throw new Error('No Momentum.json file found.');
		}

		if(config.database){
			if('rethinkdb' === config.database.adapter){
				try{
					let adapter = new DatabaseAdapter(config.database);
					this.db = yield adapter.initialize();
				} catch(err){
					throw new Error('DatabaseAdapter.initialize failed with: ' + err);
				}
			} else {
				throw new Error('Unknown DatabaseAdapter.');
			}
		} else {
			return new Error('No DatabaseAdapter was specifed.')
		}

		if(config.http){
			this.server  = new HttpServer(config.http);
		}


		//let instance = new UserApplication();

		/*for(let route in instance.routes){
			this.server.bind('get', route, function*(params){
				let view = instance.execute(this.request.url, params)
			})
		}*/

		this.server.bind('get', '/', function*(){
			this.body = React.renderToString(React.createElement(UserApplication, {}))
		});

		yield this.run();
	}
	
	onerror(err){
		console.log(err.stack);
	}
	
	
	*feedTestData(){
		yield this.r.db('test').table('fuck').insert({
			title: 'Hello ' + (Math.random() + '').slice(2,10),
			content: 'blubb'
		});
	
		
		console.log('new dataset')
		yield wait(2500);
		
		return yield this.feedTestData();

		function wait(ms){
			return function(done){
				setTimeout(done, ms);
			}
		}
	}
	
	*run (){
		yield this.server.run();
	}
}

new Momentum();

