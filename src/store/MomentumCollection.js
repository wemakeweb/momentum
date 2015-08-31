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
				/**
				 * Array.from prevents cyclic toJSON call
				 */
				value: Array.from(this),
				meta: {
					query: this.meta.query
				}
			}
		}
	}

	static fromDataObj(dataObj){
		let array = Array.prototype.slice.call(dataObj.value);
		this.decorateArray(array, dataObj.meta);
		return array;
	}
}