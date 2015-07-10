import React from 'react';
import Router from '../src/MomentumRouter';
import Route from '../src/MomentumRoute';
import Compontent from '../src/MomentumComponent';


export default class Application extends React.Component {
	render(){
		return (<html>
			<head>
				<title></title>
				<Compontent src="bower_compontents/bootstrap.css" />
			</head>
			<body>
				<h1>Hello from Momentum</h1>

				<Router>
					<Route handler="myDefaultView" path="/users" default />
					<Route handler="myDefaultView" path="/projects" />
				</Router>
			</body>
		</html> 
		)
	}
}