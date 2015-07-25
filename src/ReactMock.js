import { MomentumNode } from 'src/MomentumNode';

export default class ReactMock {}

ReactMock.createElement = function(tagName, attrs, ...childs){
	return new MomentumNode(tagName, attrs, ...childs);
};