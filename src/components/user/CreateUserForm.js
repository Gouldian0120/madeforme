import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUser } from '../../redux/reducers/authReducer';

class CreateUserForm extends Component {
    constructor({ createUser, router, errAuth }) {
        super();
        this.state = { firstName: '', lastName: '', email: '', password: '' };
        this.onInputChange = this.onInputChange.bind(this);
        this.onCreateSubmit = this.onCreateSubmit.bind(this);
    }

    onInputChange(key, ev) {
        this.setState({ [key]: ev.target.value })
    }

    onCreateSubmit(ev) {
        ev.preventDefault()
        const userInfo = this.state;
        const router = this.props.router;
        // validate on client side here
        this.props.createUser(userInfo, router)
    }

    render() {
        return (
            <div className=''>
                <h3>Create your user profile</h3>
                { this.props.errAuth ? <div className='alert alert-danger'>{this.props.errAuth}</div> : null }
                <form className='custom-form'>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'firstName') } className="form-control" value={this.state.firstName} placeholder='First name'/>
                    </div>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'lastName') } className="form-control" value={this.state.lastName} placeholder='Last name'/>
                    </div>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'email') } className="form-control" value={this.state.email} placeholder='email'/>
                    </div>
                    <div className="form-group">
                        <input onChange={ this.onInputChange.bind(null, 'password') } className="form-control" value={this.state.password} placeholder='password' type='password' />
                    </div>
                    <button className="custom-button-1" onClick={ this.onCreateSubmit }>Create account</button>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => (
    {
        createUser: (userInfo, router) => dispatch(createUser(userInfo))
                                            .then( () => {
                                                router.push('/checkout/shipping')
                                            })
                                            .catch( err => console.log(err))
    }
)



export default connect(null, mapDispatchToProps)(CreateUserForm);

