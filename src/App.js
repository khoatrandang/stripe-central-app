import React, { Component } from 'react';
import { Tabs, Tab } from './components/Tabs';
import Checkout from './components/Checkout';

import './App.css';

import KEY_DATA from './env.json';

class App extends Component {
	render() {
		return (
			<Tabs>
				<Tab name="Checkouts">
					<Checkout/>
				</Tab>
				<Tab name="Payments">
					<div><h2>Hello Payment page</h2></div>
				</Tab>
			</Tabs>
		);
	}
}

export default App;
