export default class ClientRuntime {
	constructor(UserApplication){
		this.instance = new UserApplication();
		this.render();
	}

	render(){
		let view = this.instance.renderToNode(document.body);
		this.instance.trigger('attached');
	}
}