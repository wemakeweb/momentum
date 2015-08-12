export default class MomentumRecord {
	constructor(obj, metaProps){
		for(let key in obj){
			if(obj.hasOwnProperty(key)){
				if(key === 'primaryKey'){
					this.setPrimaryKey(obj[key]);
				} else {
					this[key] = obj[key];
				}
			}
		}

		if(metaProps){
			if(metaProps.primaryKey){
				this.setPrimaryKey(metaProps.primaryKey);
			}

			this.setMeta(metaProps);
		}
	}

	setPrimaryKey(primaryKey){
		if(this.primaryKey){
			throw new Error('Record has already a primaryKey');
		}

		Object.defineProperty(this, 'primaryKey', {
			value: primaryKey,
			enumerable: false,
			writable: false,
			configurable: false
		});
	}

	setMeta(obj){
		if(!this.meta){
			Object.defineProperty(this, 'meta', {
				value: {},
				enumerable: false,
				writable: true,
				configurable: true
			});
		}


		for(let key in obj){
			this.meta[key] = obj[key];
		}
	}

	update(propsToUpdate){
		let obj = {};

		for(let key in this){
			if(this.hasOwnProperty(key)){
				obj[key] = this[key];
			}
		}

		for(let key in propsToUpdate){
			obj[key] = propsToUpdate[key];
		}

		return new MomentumRecord(obj);
	}

	toJSON(){
		let values = {};

		for(let key in this){
			if(this.hasOwnProperty(key)){
				values[key] = this[key];
			}
		}

		return {
			type: 'MomentumRecord',
			value: values,
			meta: {
				primaryKey: this.meta.primaryKey,
				query: this.meta.query
			}
		}
	}
}