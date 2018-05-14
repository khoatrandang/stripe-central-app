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

class _SplitForm extends React.Component {
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
												onBlur={this.handleBlur}
												onChange={this.handleChange}
												onFocus={this.handleFocus}
												onReady={this.handleReady}
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

		this.state = {
			canMakePayment: false
		};
	}

	componentDidMount() {
		this.paymentRequest().on('token', ({complete, token, ...data}) => {
			console.log('Received Stripe token: ', token);
			console.log('Received customer information: ', data);
			complete('success');
		});

		this.paymentRequest().canMakePayment().then(result => {
			this.setState({canMakePayment: !!result});
		});
	}

	paymentRequest() {
		return this.props.stripe.paymentRequest({
			country: 'US',
			currency: 'usd',
			total: {
				label: 'Demo total',
				amount: 1000,
			},
		});
	}

	render() {
		return this.state.canMakePayment ? (
			<PaymentRequestButtonElement
				className="PaymentRequestButton"
				onBlur={this.handleBlur}
				onClick={this.handleClick}
				onFocus={this.handleFocus}
				onReady={this.handleReady}
				paymentRequest={this.paymentRequest}
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

				console.log("props: ", props);
				
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
											<PaymentRequestForm/>
									</Elements>
									: null
								}
						</div>
				)
		}
}
