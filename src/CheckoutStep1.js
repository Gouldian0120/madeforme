import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveShipping } from './reducers/orderReducer';

/*** Shipping Form ***/
class CheckoutStep1 extends Component {
    constructor({ activeUser, saveCheckoutStep, orderId }) {
        super();
        this.state = { addressLine1: '', addressLine2: '', city: '', state: '', zip: '', country: '' };
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onInputChange(key, ev) {
        this.setState({ [key]: ev.target.value })
    }

    onSubmit(ev) {
        ev.preventDefault();
        const userInfo = this.state;
        const orderId = this.props.orderId;
        this.props.saveCheckoutStep(userInfo, orderId, saveShipping, 'billing');
        // validate on client side not done
    }

    render() {
        return (
            <div className='container'>
                <h3>Your shipping address</h3>
                <form>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'addressLine1') } className="form-control" value={this.state.addressLine1} placeholder='Street address'/>
                    </div>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'addressLine2') } className="form-control" value={this.state.addressLine2} placeholder='Street address'/>
                    </div>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'city') } className="form-control" value={this.state.city} placeholder='City'/>
                    </div>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'zip') } className="form-control" value={this.state.zip} placeholder='Zip code'/>
                    </div>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'country') } className="form-control" value={this.state.country} placeholder='Country'/>
                    </div>
                    <button onClick={ this.onSubmit }>Save shipping address</button>

                </form>
            </div>
        )
    }
}

export default CheckoutStep1;

