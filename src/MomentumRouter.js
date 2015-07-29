import MomentumView from './MomentumView';
import {isClient} from './utils';
import * as DomEvent from './DomEvent';
import * as Dom from './Dom';
import pathToRegexp from 'path-to-regexp';
import { default as React } from './ReactMock' 

export default class MomentumRouter extends MomentumView {
	routes = []

	constructor(attrs, ...childs){
		super(attrs, ...childs);

		this.mountPoint = this.attrs.mountPoint;

		for(let route in this.attrs.routes){
			this.add(route, this.attrs.routes[route]);
		}

		this.bind();
	}

	/**
	 * add all the routing logic here
	 */
	add(path, handler){
		let keys = [];
		let regex = pathToRegexp(path, keys);

		this.routes.push({
			regex: regex,
			handler: handler,
			path: path,
			keys: keys
		});
	}

	bind(){
		if(isClient){
			DomEvent.add(window, 'popstate', this.popstate.bind(this));
			DomEvent.add(window, 'hashchange', this.hashchange.bind(this));
			DomEvent.add(document, 'click', this.genericClick.bind(this));
		}
	}

	hashchange(){
		console.log('hashchange', arguments)
	}

	popstate(){
		let href = window.location.pathname



		console.log('popstate', arguments)
	}

	genericClick(ev){
		let {event, target} = DomEvent.normalize(ev);
      	
        if(!target){
        	return;
        }

        let anchor = Dom.findParentNode(target, 'a');

        if(anchor){
        	let href = Dom.value(anchor.attributes.href);
   	        this.shouldNavigate(event, href);
        } 
     }

	shouldNavigate(event, url){
		let match = this.match(url);

		if(!match){
			return
		}

		DomEvent.prevent(event);
		history.pushState({}, document.title, url)
		this.setState({route: match});
	}

	match(path){
		let routes = this.routes;
		let match;

		routes.forEach(route => {
			let regExp = new RegExp(route.regex);
			
			console.info('Match %s against %s', path, route.regex);

			if(path.match(regExp)){
				match = route
			}
		})

		return match;
	}

	render(){
		if(this.state.route){
			return (<div>{this.renderView()}</div>);
		} else {
			return (<div>Nothing Selected</div>);
		}
	}

	renderView(){
		let handler = new this.state.route.handler();
		let view = handler.render();
		return view;
	}
}