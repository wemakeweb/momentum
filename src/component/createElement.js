import MomentumNode from './MomentumNode';
import { isFunction } from '../utils';

export default function createElement(tagNameOrComponent, attrs, ...childs){
	if(isFunction(tagNameOrComponent)){
		return new tagNameOrComponent(attrs, ...childs);
	} else {
		return new MomentumNode(tagNameOrComponent, attrs, ...childs);
	}
};