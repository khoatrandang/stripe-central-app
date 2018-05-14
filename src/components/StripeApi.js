import React, { Component } from 'react'

export function withStripeData(WrappedComponent, publicKey, secretKey, route) {
	const base = class extends React.Component {
		constructor(props) {
			super(props);

			this.state = {
				data: [],
				isLoading: false
			}

			this.refresh = this.refresh.bind(this);
		}

		componentDidMount() {
			this.refresh();
		}

		async refresh() {
			this.setState({
				isLoading: true
			});

			const responseData = await this.props.getSecret(route);
			console.log("responseData: ", responseData);
			
			this.setState({
				data: responseData.data,
				isLoading: false
			});
		}

		render() {
			return <WrappedComponent
				data={this.state.data}
				isLoading={this.state.isLoading}
				{...this.props}
			/>;
		}
	}

	return withStripeApi(base, publicKey, secretKey);
}

export function withStripeApi(WrappedComponent, publicKey, secretKey) {
	const request = async (route, key, method, postData) => {
		let dataStr = null;
		if ( postData ) {
			dataStr = Object.keys(postData).map(k => {
				return `${k}=${postData[k]}`
			}).join('&')
		}

		const response = await fetch('https://api.stripe.com/v1/' + route, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Authorization': `Bearer ${key}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: dataStr
		});

		return await response.json();
	}

	return class extends React.Component {
		postPublic(route, postData) {
			return request(route, publicKey, 'POST', postData);
		}

		postSecret(route, postData) {
			return request(route, secretKey, 'POST', postData);
		}

		getSecret(route) {
			return request(route, secretKey, 'GET', null);
		}

		render() {
			return <WrappedComponent
					postPublic={this.postPublic}
					postSecret={this.postSecret}
					getSecret={this.getSecret}
					{...this.props}
				/>
		}
	}
}
