import { isType, isFunction } from './utils';

export class MomentumNode {
	children = []
	nodeName =  null
	attributes = {}
	documentNode = null
	attached = false

	constructor(nodeName, attributes, ...children){
		this.nodeName = nodeName;
		this.attributes = attributes;

		if(children.length === 1 && isType(String, children[0])){
			this.children.push(new MomentumNode('text', { 
				text: children[0] 
			}));
		} else {
			this.children = children;
		}
	}

	hasChilds(){
		return this.children.length > 0;
	}
}

export class Div extends MomentumNode {
	constructor(attributes, ...children){
		super('div', attributes, ...children);
	}
}

export class A extends MomentumNode {
	constructor(attributes, ...children){
		super('a', attributes, ...children);
	}
}