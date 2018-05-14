import React, { Component } from 'react';
import { StripeProvider } from 'react-stripe-elements';
import { Tabs, Tab } from './components/Tabs';
import Checkout from './components/Checkout';
import Payments from './components/Payments';
import { withStripeApi, withStripeData } from './components/StripeApi';

import './App.css';

import KEY_DATA from './env.json';

const SuperCheckout = withStripeApi(Checkout, KEY_DATA.publicKey, KEY_DATA.secretKey);

const SuperPayment = withStripeData(Payments, KEY_DATA.publicKey, KEY_DATA.secretKey, 'charges');

class App extends Component {
	render() {
		return (
			<StripeProvider apiKey={KEY_DATA.publicKey}>
				<Tabs>
					<Tab name="Checkouts">
						<SuperCheckout/>
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
