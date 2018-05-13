import React, { Component } from 'react'

export default class Checkout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latestCharge: "None"
        }

        this.createCharge = this.createCharge.bind(this);
    }

    createCharge() {

    }

    render() {
        return (
            <div>
                <h2>Welcome to Checkout page</h2>
                <input onChange={ (e) => this.onChangeInput(e.target.value)} placeholder="Input a value"/>
                <button onClick={ this.createCharge() }>Charge $</button>
                <h5>Latest charge is { this.state.latestCharge }</h5>
            </div>
        )
    }
}
