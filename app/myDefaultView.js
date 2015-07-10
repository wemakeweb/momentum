import MomentumView from '../src/MomentumView';
import React from 'react';

export default class myDefaultView extends MomentumView {
	   getInitialState() {
    	return {secondsElapsed: 0};
  	}

  	tick() {
    	this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  	}
  
  	componentDidMount() {
    	this.interval = setInterval(this.tick, 1000);
  	}
  
  	componentWillUnmount() {
    	clearInterval(this.interval);
  	}

  	render() {
    	return (
      		<div>Seconds Elapsed: {this.state.secondsElapsed}</div>
    	);
  	}
}