import React, { Component } from 'react';
import {
  Elements,
  PaymentRequestButtonElement,
  CardElement,
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

const handleBlur = () => {
	console.log('[blur]');
};
const handleChange = change => {
	console.log('[change]', change);
};
const handleClick = () => {
	console.log('[click]');
};
const handleFocus = () => {
	console.log('[focus]');
};
const handleReady = () => {
	console.log('[ready]');
};

class _SplitForm extends React.Component {

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

  render() {
		return (
			<form onSubmit={this.handleSubmit}>
			<label>
				Card number
				<CardNumberElement
				onBlur={handleBlur}
				onChange={handleChange}
				onFocus={handleFocus}
				onReady={handleReady}
				{...createOptions(this.props.fontSize)}
				/>
			</label>
			<label>
				Expiration date
				<CardExpiryElement
				onBlur={handleBlur}
				onChange={handleChange}
				onFocus={handleFocus}
				onReady={handleReady}
				{...createOptions(this.props.fontSize)}
				/>
			</label>
			<label>
				CVC
				<CardCVCElement
				onBlur={handleBlur}
				onChange={handleChange}
				onFocus={handleFocus}
				onReady={handleReady}
				{...createOptions(this.props.fontSize)}
				/>
			</label>
			<label>
				Postal code
				<PostalCodeElement
				onBlur={handleBlur}
				onChange={handleChange}
				onFocus={handleFocus}
				onReady={handleReady}
				{...createOptions(this.props.fontSize)}
				/>
			</label>
			<button>Confirm order</button>
			</form>
		);
  }
}

const SplitForm = injectStripe(_SplitForm);

class _CardForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(ev) {
		ev.preventDefault();
		if (this.props.stripe) {
			this.props.stripe
				.createToken()
				.then(payload => console.log('[token]', payload));
		} else {
			console.log("Stripe.js hasn't loaded yet.");
		}
	};

	render() {
		return (
			<form onSubmit={(e) => this.handleSubmit(e)}>
				<label>
					Card details
					<CardElement
						onBlur={handleBlur}
						onChange={handleChange}
						onFocus={handleFocus}
						onReady={handleReady}
						{...createOptions(this.props.fontSize)}
					/>
				</label>
				<button>Pay</button>
			</form>
		);
	}
}

const CardForm = injectStripe(_CardForm);

class _PaymentRequestForm extends React.Component {
  constructor(props) {
		super(props);
		
		const paymentRequest = this.props.stripe.paymentRequest({
			country: 'US',
			currency: 'usd',
			total: {
				label: 'Demo total',
				amount: 1000,
			},
		});

		paymentRequest.on('token', ({complete, token, ...data}) => {
			console.log('Received Stripe token: ', token);
			console.log('Received customer information: ', data);
			complete('success');
		});
		
		paymentRequest.canMakePayment().then(result => {
			console.log("result: ", result);
			this.setState({canMakePayment: !!result});
		});

		this.state = {
			canMakePayment: false,
			paymentRequest,
		};
  }

  render() {
		return this.state.canMakePayment ? (
			<PaymentRequestButtonElement
				className="PaymentRequestButton"
				onBlur={handleBlur}
				onClick={handleClick}
				onFocus={handleFocus}
				onReady={handleReady}
				paymentRequest={this.state.paymentRequest}
				style={{
					paymentRequestButton: {
					theme: 'dark',
					height: '64px',
					type: 'donate',
					},
				}}
			/>
		) : null;
  }
}

const PaymentRequestForm = injectStripe(_PaymentRequestForm);

export default class Checkout extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
		};

		window.addEventListener('resize', () => {
		  if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
			  this.setState({elementFontSize: '14px'});
		  } else if (
			  window.innerWidth >= 450 &&
			  this.state.elementFontSize !== '18px'
		  ) {
			  this.setState({elementFontSize: '18px'});
		  }
		});
	}

	render() {
		const {elementFontSize} = this.state;
		return (
			<div>
				<h2>Welcome to Checkout page</h2>
				<Elements>
					<CardForm fontSize={elementFontSize}/>
				</Elements>
				{
				  this.props.stripe ?
				  <Elements>
					  <PaymentRequestForm stripe={this.props.stripe}/>
				  </Elements>
				  : null
				}
			</div>
		)
	}
}
