export function add(node, type, fn){
	// w3c 
	if(node.addEventListener){
   		node.addEventListener(type, fn, false);
	} else if (node.attachEvent){ // old IE
    	node.attachEvent('on' + type, fn);
    } else {
      throw new Error('DomEvent.add can not attach listeners');
    }
}

export function remove(node, type, fn){
	// w3c 
	if(node.removeEventListener){
   		node.removeEventListener(type, fn, false);
	} else if (node.detachEvent){ // old IE
    	node.detachEvent('on' + type, fn);
    } 
}

export function prevent(event){
	if(event){
		if(event.preventDefault){
			event.preventDefault();
		} else{
			event.returnValue = false;
		}
	}
}

export function normalize(event){
	return { 
		event: event || window.event,
		target: event.target || event.srcElement
	}
}