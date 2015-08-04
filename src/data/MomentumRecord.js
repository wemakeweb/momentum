export default class MomentumRecord {
	_primaryKey = null

	constructor(obj){
		for(let key in obj){
			this[key] = obj;
		}
	}
}