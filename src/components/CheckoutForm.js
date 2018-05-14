import React from 'react';
import { connect } from "react-redux";
import {
	CardNumberElement,
	CardExpiryElement,
	CardCVCElement,
	PostalCodeElement,
	injectStripe
} from 'react-stripe-elements';

const createOptions = (fontSize) => {
	return {
		style: {
			base: {
				fontSize,
				color: '#424770',
				letterSpacing: '0.025em',
				fontFamily: 'Source Code Pro, monospace',
				'::placeholder': {
					color: '#aab7c4',
				},
			},
			invalid: {
				color: '#9e2146',
			},
		},
	};
};

class CheckoutForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleBlur   = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClick  = this.handleClick.bind(this);
		this.handleFocus  = this.handleFocus.bind(this);
		this.handleReady  = this.handleReady.bind(this);
	}

	handleSubmit = (ev) => {
		// We don't want to let default form submission happen here, which would refresh the page.
		ev.preventDefault();

		if (this.props.stripe) {
			// Within the context of `Elements`, this call to createToken knows which Element to
			// tokenize, since there's only one in this group.
			this.props.stripe.createToken().then(({token}) => {
				console.log('Received Stripe token:', token);
			});
		} else {
			console.log("Stripe.js hasn't loaded yet.");
		}
	}

	handleBlur() {
		console.log('[blur]');
	};
	handleChange = change => {
		console.log('[change]', change);
	};
	handleClick() {
		console.log('[click]');
	};
	handleFocus() {
		console.log('[focus]');
	};
	handleReady() {
		console.log('[ready]');
	};

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Card number
					<CardNumberElement
						onBlur={this.handleBlur}
						onChange={this.handleChange}
						onFocus={this.handleFocus}
						onReady={this.handleReady}
						{...createOptions(this.props.fontSize)}
					/>
				</label>
				<label>
					Expiration date
					<CardExpiryElement
						onBlur={this.handleBlur}
						onChange={this.handleChange}
						onFocus={this.handleFocus}
						onReady={this.handleReady}
						{...createOptions(this.props.fontSize)}
					/>
				</label>
				<label>
					CVC
					<CardCVCElement
						onBlur={this.handleBlur}
						onChange={this.handleChange}
						onFocus={this.handleFocus}
						onReady={this.handleReady}
						{...createOptions(this.props.fontSize)}
					/>
				</label>
				<label>
					Postal code
					<PostalCodeElement
						onBlur={this.handleBlur}
						onChange={this.handleChange}
						onFocus={this.handleFocus}
						onReady={this.handleReady}
						{...createOptions(this.props.fontSize)}
					/>
				</label>
				<button>Confirm order</button>
			</form>
		);
	}
}

export default injectStripe(CheckoutForm);
// export default connect(null, null, null, { pure: false })(injectStripe(CheckoutForm));