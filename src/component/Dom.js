export function findParentNode(node, target){
	target = target.toUpperCase();

    while(node){
    	if(node.tagName === target){
    		return node;
    	}
    	node = node.parentElement;
    }
    
    return false;
}


export function value(node){
	return node.value ? node.value : node.nodeValue
}

export function setAttr(node, attribute, value){
	node.setAttribute(attribute, value);
}

/**
 * incomplete list of all
 * allowed inline Attributes
 */

let inlineAttrs = [
    'action',
    'alt',
    'autoComplete',
    'autoPlay',
    'checked',
    'class',
    'cols',
    'controls',
    'disabled',
    'href',
    'id',
    'label',
    'loop',
    'method',
    'min',
    'muted',
    'name',
    'placeholder',
    'poster',
    'preload',
    'readOnly',
    'rel',
    'required',
    'role',
    'rows',
    'spellCheck',
    'src',
    'tabIndex',
    'target',
    'title',
    'type'
];

export function isInlineAttr(attr){
	return inlineAttrs.indexOf(attr) > -1;
}


export function isEvent(attr){
	return attr.startsWith('on');
}