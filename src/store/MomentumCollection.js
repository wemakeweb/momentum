export default class MomentumCollection {

	static decorateArray(array, meta){
		this.setMeta(array, meta);
		this.setMethods(array);
	}

	static setMeta(array, meta){
		if(!array.meta){
			Object.defineProperty(array, 'meta', {
				value: {},
				enumerable: false,
				writable: true,
				configurable: true
			});
		}

		for(let key in meta){
			array.meta[key] = meta[key];
		}
	}

	static setMethods(array){
		Object.defineProperty(array, 'toJSON', {
			value: toJSON.bind(array),
			enumerable: false,
			writable: true,
			configurable: true
		});

		function toJSON() {
			return {
				type: 'MomentumCollection',
				value: this,
				meta: {
					query: this.meta.query
				}
			}
		}
	}

	static fromDataObj(dataObj){
		this.createFromArray(dataObj.value, dataObj.meta);
	}
}