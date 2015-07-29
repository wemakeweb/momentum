var globalNamespace;

if(typeof window !== 'undefined'){
	globalNamespace = window;
} else if(typeof global !== 'undefined'){
	globalNamespace = global; 
} else {
	throw new Error('Could not determine globalNamespace');
}

globalNamespace.assets = function(assets){
	return function(classDeclaration){
		return classDeclaration;
	}
};