import merge from 'merge';
import { isType, isClient } from './utils';
import { setAttr, inlineAttrs, isInlineAttr, isEvent } from './Dom';
import * as DomEvent from './DomEvent';
import EventEmitter from 'wolfy87-eventemitter';

export default class MomentumView extends EventEmitter{
	/**
	 * the document node the view 
	 * is mounted on
	 */
	node = null


	state = {}
	_dirty = false;

	/**
	 * naiv implementation
	 */
	set(obj){
		merge(this.state, obj);
		this._dirty = true;
		this.renderToNode();
		this._dirty = false;
	}


	constructor(){
		super();
		this.on('attached', this._onAttached.bind(this));
	}


	/**
	 * renders component and updates
	 * the dom node
	 */
	renderToNode(){
		let newNode = document.createElement('div');
		let renderTree = this.render();
		this._renderToNode(newNode, renderTree);

		if(this.node){
			console.log('replaceChild')
			this.node.parentNode.replaceChild(newNode, this.node);
		} 

		this.node = newNode;
		return this.node;
	}


	_renderToNode(parentNode, node){
		let selfRepresentation;

		if(node.nodeName === 'text'){
			selfRepresentation = document.createTextNode(node.attributes.text);
		} else {
			selfRepresentation = document.createElement(node.nodeName);

			if(node.hasChilds()){
				Array.from(node.children).forEach((child) => {
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

		node.documentNode = selfRepresentation;
		parentNode.appendChild(selfRepresentation);
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
    
    // attached state variable
    attached = false

    _onAttached(){
    	this.attached = true;

    	for(let eventType in this.domEvents){
    		DomEvent.add(
    			this.node,
    			eventType,
    			this.genericEventHandler.bind(this, eventType)
    		);
    	}
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
			fn
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