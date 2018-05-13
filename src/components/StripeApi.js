import React, { Component } from 'react'

function withStripeApi(WrappedComponent, clientId) {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				token: null
			};
		}

		componentWillMount() {
			const existingToken = sessionStorage.getItem('token');
			const accessToken = (window.location.search.split("=")[0] === "?access_token") ? window.location.search.split("=")[1] : null;

			if (!accessToken && !existingToken) {
				window.location.replace(`https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientId}`)
			}

			if (accessToken) {
				console.log(`New accessToken: ${accessToken}`);

				sessionStorage.setItem("token", accessToken);
				this.setState({
					token: accessToken
				});
			}

			if (existingToken) {
				this.setState({
					token: existingToken
				});
			}
		}

		render() {
			return <WrappedComponent
				token={this.state.token}
				{...this.props} />
		}
	}
}
