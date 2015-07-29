import { isType, isFunction } from './utils';

export default class MomentumNode {
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