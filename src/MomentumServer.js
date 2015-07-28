import koala from 'koala';
import router from 'koa-router';
import serve from 'koa-static';
import session from 'koa-generic-session';
import _ from 'underscore';
import Params from './params';
import Path from 'path';
import os from 'os';

export default class MomentumServer{
	constructor(config){
		this.config = config;
		var server = koala();

		// mount the router
		server.use(router(server));

		// reset error handler
		server.errorHandler = errorHandler;

		// setup session
		/*var redisClient = redis.createClient( 
			Risotto.config.redis.port || 6379, 
			Risotto.config.redis.host || '127.0.0.1',
			Risotto.config.redis.config || {}
		);

		var redisStore = new RedisStore({
	  		client : redisClient
	  	});

		redisClient.on('error', function(err){
			Risotto.exit('Failed with ' + err);
		});
			
		server.use(session({
	  		store: redisStore
		}));*/

		// expose redisClient as `redis` to Risotto
		// Risotto.redis = coRedis(redisClient);

		//server.keys = Risotto.config.http.session.secret;
		/*server.keys = _.isArray(Risotto.config.http.session.secret) ? 
			Risotto.config.http.session.secret : 
			[Risotto.config.http.session.secret];*/

		//setup logger for all request
		/*this.server.use(
			express.logger({
				format : Yolo.config.http.logger,
				stream : Yolo.logger
			})
		);*/

		// expose server
		this.server = server;
		
		// static serving
		//server.use(serve(Risotto.APP + 'public'));
	}

	run(){
		this.server.listen(this.config.port);
		console.log('up & running @ %s', this.config.port);
	}

	bind(method, path, fn){
		this.server[method](path, fn);
	}
}



function getFilters(filters, methodName){
	var toCall = [];

	if(_.isString(filters)){
		toCall = [filters]
	} else if(!_.isArray(filters)){
		for(var filter in filters){
			var val = filters[filter];

			if((_.isArray(val) && val.indexOf(methodName) > -1 ) || 
				val === methodName || 
				val === '*'){
				toCall.push(filter)
			}
		}
	} else {
		toCall = filters;
	}

	return toCall;
}


/**
 * Calls the actual controller specified in `route`.
 * @param {Object} route
 * @api private
 */

function callRoute(route){
	var fn = route.to.split('.');

	return function* callRoute(next){
 		Risotto.logger.info('callRoute');

		if(Risotto.devMode){
			Risotto.logger.log('-> ' + fn[0] + "." + fn[1] + ' ' + JSON.stringify(this._params));
		}

		//make params in the whole controller available
		this._instance.params = this._params;
		
		yield this._instance[fn[1]](this._params);

		//render default
		if(!this.type && !this.body){
			yield this._instance.render(fn.join('/'));
		}		
	};
};


/**
 * Middleware
 * call the before & after filter
 * @api private
 */
 function filter(route){
 	var fn = route.to.split('.');

 	return function* beforeFilters(next){
 		var before = getFilters(this._instance.beforeFilter, fn[1]),
 			after = getFilters(this._instance.afterFilter, fn[1]);

 		try{
	 		Risotto.logger.info('beforeFilter: ' + before);
 			yield Risotto.callBefore(before, this._instance);
 			yield next;
 			Risotto.logger.info('afterFilter: ' + after);
 			yield Risotto.callAfter(after, this._instance);
 		} catch(err){
 			yield Risotto.application.onError(this, next, err);
 		}
 	}
 }



/**
 * Middleware
 * initialize a controller instance
 * @api private
 */
 function initController(route){
 	var fn = route.to.split('.');

 	return function*(next){
 		Risotto.logger.info('initController');
		var controller = Risotto.controllers[fn[0]];
		this._instance = new controller();
		this._instance.koaContext = this;
		yield next;
 	}
 }

/**
 * Middleware
 * builds up the params object
 * @api private
 */

function* buildParams(next){
	Risotto.logger.info('buildParams');
	var params = new Params();
	
	// merge everything
	params.set( _.extend({},
		this.params,
		this.request.query,
		yield* this.request.urlencoded(),
		yield* this.request.json(),
		this.req.files)
	);

	if('multipart' === this.request.is('multipart')){
		var parts = this.request.parts();
		var part;

		while (part = yield parts) {
			if (part.length) {
				params.set(part[0], part[1]);
			} else {
				var path = Path.join(os.tmpDir(), (new Date()).getTime() + "");
				yield this.save(part, path); 
				part.path = path;
				params.setFile(part);
			}    
		}
	}


	this._params = params;
	yield next;
}

/**
 * Handler for generic errors.
 * @param {Generator} next
 * @api private
 */

function* errorHandler(next){
	try {
  		yield next;
  		if (404 == this.response.status && !this.response.body){
  			this.throw(404);
  		}
	} catch (err) {
  		var status = err.status || 500;
  		this.status = status;

  		if(404 == status){
  			//yield Risotto.application.onNotFoundError(this, next);
  		} else {
  			console.log(err.stack);
  			//yield Risotto.application.onError(this, next, err);
  		}
  	}
}

/**
 * Returns a route name for `route`.
 * @param route {Object}
 * @api private
 */
function namedRouteFor(route){
	return route.to.replace(/(\/|\.)/g,'_').toLowerCase();
}



/**
 * Binds the `routes`.
 * @api private
 */

/*Http.prototype.bind = function(){
	this.routes.forEach(function(route){
		console.log(namedRouteFor(route) + ' ' + route.path + ' -> ' + route.to);
		this.server[route.via](
			namedRouteFor(route),
			route.path,
			buildParams,
			initController(route),
			filter(route),
			callRoute(route)
		);
	}, this);
}; */