import React, { Component } from 'react';

export default class Payments extends Component {

    render() {
        if ( this.props.isLoading ) {
            return <div>Loading...</div>
        }

        const payments = this.props.data.map((payment, index) => <Payment key={index} payment={payment}/>);
        return (
            <div>
                <h2>Welcome to Payments page</h2>
                <div>
                    <h2>Payments</h2>
                    <table>
                        <thead>
                            <tr>
                                <td>Id</td>
                                <td>Amount</td>
                                <td>Refunded</td>
                                <td>Disputed</td>
                                <td>Reason</td>
                                <td>Refund</td>
                            </tr>
                        </thead>
                        <tbody>
                            {payments}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

class Payment extends React.Component {
    render() {
        console.log("props: ", this.props);

        return (
            <tr>
                <td>{this.props.payment.id}</td>
                <td>{this.props.payment.amount}</td>
                <td>{this.props.payment.refunded.toString()}</td>
                <td>{(this.props.payment.dispute !== null).toString()}</td>
                <td>{this.props.payment.refundReason}</td>
                <td><button disabled={this.props.payment.refunded || this.props.payment.dispute}></button></td>
            </tr>
        )
    }
}
