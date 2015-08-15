var globalNamespace; 
var isClient = false;

if(typeof window !== 'undefined'){
	globalNamespace = window;
	isClient = true;
} else if(typeof global !== 'undefined'){
	globalNamespace = global; 
} else {
	throw new Error('Could not determine globalNamespace');
}

globalNamespace.assets = function(assets){
	if(isClient){
		assets.styles.forEach(function(path){
			System.import(path)
		})
	}

	return function(classDeclaration){
		return classDeclaration;
	}
};