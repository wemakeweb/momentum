export function set(nodeTree, property, value){
	if(!nodeTree[property]){
		return;
	}

    nodeTree[property] = value;

	if(nodeTree.children){
		nodeTree.children.forEach((child) => {
			set(child, property, value);
		})
	}
}