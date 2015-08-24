import { isType, isClient, isFunction } from './utils';
import { setAttr, inlineAttrs, isInlineAttr, isEvent } from './Dom';
import * as DomEvent from './DomEvent';
import EventEmitter from 'wolfy87-eventemitter';
import MomentumNode from './MomentumNode';
import MomentumStore from './data/stores/MomentumStore';
import * as MomentumTree from './MomentumTree';
import Debug from 'debug';

let debug = Debug('momentum:component');

export default class MomentumComponent extends EventEmitter {

	/**
	 * Methods you should overwrite
	 */

	/**
     * storeFetch should fetch all your
     * model dependencies and return the 
     * model cursors
     * @return MomentumModel
	*/

    storeSelect(){
		
	}

	/**
	 * gets called after one or many
	 * of your model dependencies has been
	 * updated. Arguments are records of the models
	 * returned in `storeSelect`
	 * @arguments MomentumRecod(s)
	 */

	storeDidUpdate(){
		
	}

	 /**
     * onAttached - Gets called when the 
     * components attaches to the DOM 
     */

    onAttached(){
    
    }

    /**
     * onDetached - Gets called when the 
     * components detaches from the DOM
     */

    onDetached(){

    }

    /**
     * render - Render your Component
     * @return MomentumNode | MomentumComponent
     */

	render(){
		throw new Error('You must overwrite your Components .render method. This is also not callable via super');
	}


	/** Iternal Apis **/

	/**
	 * the document node the view 
	 * is mounted on
	 */
	documentNode = null;
	state = {};

	/**
	 * currently we rerender the view
	 * everytime the state changes
	 * this is very ineffectiv in terms 
	 * of dom performance and should be 
	 * changed
	 */
	setState(obj){
		Object.assign(this.state, obj);
		
		if(isClient){
			this.renderToNode();
		}

		debug('setState');
	}

	/**
	 * holds the attributes 
	 * defaults to {}
	 */
	attrs = {};


	/**
	 * holds the child views/nodes
	 * defaults to []
	 */
	childViews = [];

	constructor(attrs, ...childs){
		super();
		this.attrs = attrs;
		this.childs = childs;

		// bind all events
		this.on('attached', this._onAttached.bind(this));
		this.initializeStore();
	}

	renderToString(){
		return '<String>';
	}

	/**
	 * renders view and updates the 
	 * dom
	 */
	renderToNode(parentNode){
		let newNode = document.createElement('div');
		this.nodeTree = this.render();
		this._renderToNode(newNode, this.nodeTree, [0]);

		if(parentNode){
			/**
			 * initial render
			 */
			parentNode.appendChild(newNode);
		} else if(this.documentNode.parentNode){
			/**
			 * if there is a `parentNode` we can
			 * call `.replaceChild` safely
			 */
			this.documentNode.parentNode.replaceChild(newNode, this.documentNode);
		}
		
		this.documentNode = newNode;
	}


	/**
	 * _renderToNode
	 * renders all child nodes recursively
	 */
	_renderToNode(parentNode, node, mids){
		let selfRepresentation;

		if(typeof node === 'undefined'){
			throw new Error(`Render: Trying to render object of type ${toString.call(node)}. 
				Only Strings, MomentumNode or MomentumComponent are allowed`);
		}


		if(node instanceof MomentumComponent){
			this.childViews.push(node);
			node.renderToNode(parentNode);
			return;
		}

		if(!(node instanceof MomentumNode)){
			selfRepresentation = document.createTextNode(node.toString());
			parentNode.appendChild(selfRepresentation);
			return;
		}

		if(node.nodeName === 'text'){
			selfRepresentation = document.createTextNode(node.attributes.text);
		} else {
			selfRepresentation = document.createElement(node.nodeName);

			//set mid to identifiy on dom events
			node.mid = mids.join('.');
			
			setAttr(
				selfRepresentation,
				'data-mid',
				node.mid
			);

			if(node.hasChilds()){
				let index = 0;

				// Array.from basicly copies the Array
				Array.from(node.children).forEach(child => {
					let subMids = mids.slice(0)
					subMids.push(index++);
					this._renderToNode(selfRepresentation, child, subMids);
				});
			}
		}

		for(var attribute in node.attributes){
			if(isInlineAttr(attribute)){
				setAttr(
					selfRepresentation, 
					attribute,
					node.attributes[attribute]
				);
			} else if(isEvent(attribute)){
				let eventType = attribute.replace(/on/, '');
				this.registerDOMEvent(node, eventType, node.attributes[attribute])				
			} else {
				debug('render: %o is not valid inline attribute', attribute);
			}
		}

		
		parentNode.appendChild(selfRepresentation);

		return node;
	}

	/**
	 * Lifecycle events
	 */

	/**
     * attached 
     * this will be called if the view is appended
     * to the dom. bind suff like event handlers 
     * after this method has been called.
     */
    
    _onAttached(){
    	for(let eventType in this.domEvents){
    		DomEvent.add(
    			this.documentNode,
    			eventType,
    			this.genericEventHandler.bind(this, eventType)
    		);
    	}

    	MomentumTree.set(this.nodeTree, 'attached', true);

    	this.childViews.forEach(view => {
    		view.trigger('attached')
    	});

    	this.onAttached();
    }

    _onDetached(){
    	// unregister Dom Events
    	// cleanup
    	this.onDetached();
    }


    /**
     * DOM event Handling
     */
    domEvents = {}

    registerDOMEvent(node, eventType, fn){
		if(!this.domEvents[eventType]){
			this.domEvents[eventType] = [];
		}

		this.domEvents[eventType].push({
			node, 
			fn: fn.bind(this)
		});
	}

    genericEventHandler(eventType, ev){
    	let {event, target} = DomEvent.normalize(ev);
    	let listeners = this.domEvents[eventType];

    	for(let i = 0, len = listeners.length; i < len; i++){
    		let listener = listeners[i];

    		if(listener.node.mid === target.getAttribute('data-mid')){
    			if(listener.fn(event) === false){
    				break;
    			}
    		}
    	}
    }

	/**
	 * @api internal
	 */

	storeBindings = []

	initializeStore(){
		let model = this.storeSelect();

		if(!model){
			if(!isClient){
				this._onReady();
			}
		}

		model.then((record) => {
			this.storeDidUpdate(record);
			if(!isClient){
				this._onReady();
			}

			if(isClient){
				this.storeBindings.push(record.meta.query);
				this.bindStore();
			}
		}).catch((err) => {
			throw err;
		})
	}

	/**
	 * @api internal
	 */

	bindStore(){
		let didUpdate = this.storeDidUpdate.bind(this);

		this.storeBindings.forEach((query) => {
			MomentumStore.bind(query.model, query, didUpdate);
		});
	}


	/**
	 * @api internal
	 * Lifecycle method to notify components ready-to-render state
	 */

	onReady(fn){
		if(isFunction(fn)) {
			this._onReady = fn;
		}
	}

	_onReady = function(){}

	/**
	 * does querySelection based on the component
	 * documentNode
	 */

	find(selector){
		if(this.documentNode){
			return this.documentNode.querySelector(selector);
		} else {
			return null;
		}
	}

	/**
	 * does querySelectionAll based on the component
	 * documentNode
	 */

	findAll(selector){
		if(this.documentNode){
			return this.documentNode.querySelectorAll(selector);
		} else {
			return null;
		}
	}
}