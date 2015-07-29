import merge from 'merge';
import { isType, isClient } from './utils';
import { setAttr, inlineAttrs, isInlineAttr, isEvent } from './Dom';
import * as DomEvent from './DomEvent';
import EventEmitter from 'wolfy87-eventemitter';
import MomentumNode from './MomentumNode';
import * as MomentumTree from './MomentumTree';

export default class MomentumView extends EventEmitter{
	/**
	 * the document node the view 
	 * is mounted on
	 */
	documentNode = null;
	state = {};
	_dirty = false;

	/**
	 * naiv implementation
	 */
	setState(obj){
		merge(this.state, obj);
		this._dirty = true;
		this.renderToNode();
		this._dirty = false;
	}

	/**
	 * holds the attributes 
	 * defaults to {}
	 */
	attrs = {};


	/**
	 * holds the child views/nodes
	 * defaults to null
	 */
	childViews = [];

	constructor(attrs, ...childs){
		super();
		this.attrs = attrs;
		this.childs = childs;

		// bind all events
		this.on('attached', this._onAttached.bind(this));
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
				Only Strings, MomentumNode or MomentumViews are allowed`);
		}


		if(node instanceof MomentumView){
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
				console.log('Render: %s is not valid inline attribute', attribute);
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
}