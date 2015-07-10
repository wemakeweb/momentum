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
