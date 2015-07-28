import { MomentumNode } from 'src/MomentumNode';
import { isFunction } from 'src/utils';

export default class ReactMock {}

ReactMock.createElement = function(tagNameOrComponent, attrs, ...childs){
	if(isFunction(tagNameOrComponent)){
		return new tagNameOrComponent(attrs, ...childs);
	} else {
		return new MomentumNode(tagNameOrComponent, attrs, ...childs);
	}
};