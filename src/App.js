import React, { Component } from 'react';
import { StripeProvider } from 'react-stripe-elements';
import { Tabs, Tab } from './components/Tabs';
import Checkout from './components/Checkout';
import Payments from './components/Payments';
import { withStripeData } from './components/StripeApi';

import './App.css';

import KEY_DATA from './env.json';

const SuperPayment = withStripeData(Payments, KEY_DATA.publicKey, KEY_DATA.secretKey, 'charges');

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {stripe: null};
	}

	componentWillMount() {
		if (window.Stripe) {
		  	this.setState({stripe: window.Stripe(KEY_DATA.publicKey)});
		} else {
			document.querySelector('#stripe-js').addEventListener('load', () => {
				// Create Stripe instance once Stripe.js loads
				this.setState({stripe: window.Stripe(KEY_DATA.publicKey)});
			});
		}
	}

	render() {
		console.log("stripe: ", this.state.stripe);
		return (
			<StripeProvider stripe={this.state.stripe}>
				<Tabs>
					<Tab name="Checkouts">
						<Checkout stripe={this.state.stripe}/>
					</Tab>
					<Tab name="Payments">
						<SuperPayment/>
					</Tab>
				</Tabs>
			</StripeProvider>
		);
	}
}

export default App;
