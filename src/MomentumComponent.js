import { isType, isClient } from './utils';
import { setAttr, inlineAttrs, isInlineAttr, isEvent } from './Dom';
import * as DomEvent from './DomEvent';
import EventEmitter from 'wolfy87-eventemitter';
import MomentumNode from './MomentumNode';
import MomentumStore from './data/stores/MomentumStore';
import * as MomentumTree from './MomentumTree';
import Debug from 'debug';

let debug = Debug('momentum:component');

export default class MomentumComponent extends EventEmitter{
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
		this.initializeStoreBinding();
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
		this._renderToNode(newNode, this.nodeTree);

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
	_renderToNode(parentNode, node){
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

			if(node.hasChilds()){
				Array.from(node.children).forEach(child => {
					this._renderToNode(selfRepresentation, child);
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
    
    // @overwrite
    onAttached(){
    	//… your attached callback here
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
    	let listener = this.domEvents[eventType];

    	for(let i = 0, len = listener.length; i < len; i++){
    		if(listener[i].fn(event) === false){
    			break;
    		}
    	}
    }

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
	 * @api internal
	 */

	storeBindings = []

	initializeStoreBinding(){
		let model = this.storeSelect();

		if(!model) return;

		model.then((record) => {
			this.storeDidUpdate(record);
			this.storeBindings.push(record.meta.query);
			this.bindStore();
		}).catch((err) => {
			throw err;
		})
	}

	bindStore(){
		let didUpdate = this.storeDidUpdate.bind(this);

		this.storeBindings.forEach((query) => {
			MomentumStore.bind(query.model, query, didUpdate);
		});
	}
}