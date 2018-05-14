import React, { Component } from 'react';

export default class Checkout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latestCharge: "None"
        }

        this.createCharge = this.createCharge.bind(this);
    }

    async createCharge() {
        this.setState({
            latestCharge: "Creating token..."
        })

        const creditCardDetails = {
            'card[number]': '4242424242424242',
            'card[exp_month]': '02',
            'card[exp_year]': '2019'
        }

        const tokenData = await this.props.postPublic('tokens', creditCardDetails);
        console.log("tokenData: ", tokenData);

        this.setState({
            latestCharge: "Creating charge..."
        })

        const chargeDetails = {
            'amount': 200,
            'currency': 'usd',
            'description': 'test charge codewalkthrough',
            'source': tokenData.id
        }

        const chargeData = await this.props.postSecret('charges', chargeDetails);
        console.log("chargeData: ", chargeData);

        this.setState({
            latestCharge: chargeData.id
        })
    }

    render() {
        return (
            <div>
                <h2>Welcome to Checkout page</h2>
                <input onChange={ (e) => this.onChangeInput(e.target.value)} placeholder="Input a value"/>
                <button onClick={ this.createCharge }>Charge $</button>
                <h5>Latest charge is { this.state.latestCharge }</h5>
            </div>
        )
    }
}
