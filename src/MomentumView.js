import React from 'react';
import merge from 'merge';


export default class MomentumView  {
	state = {}
	_dirty = false;

	/**
	 * naiv implementation
	 */
	set(obj){
		merge(this.state, obj);
		this._dirty = true;
		this.render();
		this._dirty = false;
	}
}