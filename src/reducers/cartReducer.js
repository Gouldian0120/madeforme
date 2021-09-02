import axios from 'axios';

/*** Constants ***/
import {
    LOAD_CART,
    REMOVE_FROM_CART,
    ADD_TO_CART,
    CLEAR_CART } from '../constants/';

/*** Actions ***/
import {
    loadCartSuccess,
    removeFromCartSuccess,
    addToCartSuccess,
    clearCartSuccess } from '../actions/cart';





/**** Methods ***/

// Load the state of the cart from localstorage (only when not logged in)
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }

}

// Global listener saving the cart state to localStorage
const saveState = (state) => {
    try {
        const serializeState = JSON.stringify(state);
        localStorage.setItem('cart', serializeState)
    } catch (err) {
        /* Do nothing.
         This is to make sure code does not break in case of individual users localstorage restrictions */
    }
}

// Load Cart from localStorage
/* receiving all info needed here,
incl orderLines, shippingAdr and billingAdr if they exist */
const loadCart = (orderId) => {

    // Run local if Anonymous user
    if (orderId === 0) {
        return (dispatch) => {
            const cart = loadState();
            dispatch(loadCartSuccess(cart));
            return Promise.resolve();
        }
    }

    return (dispatch) => {
        const localCart = loadState();
        const orderlines = localCart.cartItems.map( item => {
            // overwriteQty = true
            return dispatch(addToCart( orderId, item.product, item.qty, true))
        })
        return Promise.all(orderlines)
        .then( () => {
            axios.get(`/api/order/${orderId}`)
                .then(response => response.data)
                .then(order => {
                    dispatch(loadCartSuccess(order));
                })
                .catch(err => console.log('Error loadCart:', err));
        })
    };
};


// Remove items from the cart
const removeFromCart = (orderId, productId) => {
    // Run local if Anonymous user
    if (orderId === 0) {
        return (dispatch) => {
            dispatch(removeFromCartSuccess(productId));
            return Promise.resolve();
        };
    }
    // Load logged user cart
    return (dispatch) => {
        axios.delete(`/api/order/${orderId}/${productId}`)
            .then(() => {
                dispatch(removeFromCartSuccess(productId));
            })
            .catch(err => console.log('Error: removeFromCart', err));
    };
};

// Add items to the cart
const addToCart = (orderId, product, qty=1, overwriteQty=false) => {
    // if anonymous user, set the local cart to our state
    if (orderId === 0) {
        // Run local
        return (dispatch) => {
            dispatch(addToCartSuccess(orderId, product, qty, overwriteQty));
            return Promise.resolve();
        };
    }
    // if we have a logged in user, add product(s) to server
    // and set the axios response to our local state
    return (dispatch) => {
        axios.post(`/api/order/${orderId}/`, { qty, product, overwriteQty })
            .then(response => response.data)
            .then((response) => {
                dispatch(addToCartSuccess(orderId, product, qty, overwriteQty))
            })
            .catch(err => console.log('Error: addToCart', err));
    };
};


const clearCart = () => {
    return (dispatch) => {
        return dispatch(clearCartSuccess());
    };
};


/*** Reducer ***/

const initialState = {
    cartItems: [] // array of orderline objects
};

const cartReducer = (state = loadState() || initialState, action) => {
    switch (action.type) {
        case LOAD_CART:
            return { ...state, cartItems: action.cart[0].orderlines }
        case CLEAR_CART:
            return { ...state,  cartItems: [] }
        case REMOVE_FROM_CART:
            return { ...state, cartItems: state.cartItems.filter(item => item.productId !== action.productId) }
        case ADD_TO_CART:
            let cartItems;
            let productExistsInCart = state.cartItems.some(item => item.productId === action.product.id) // boolean

            if ( productExistsInCart ) {
                cartItems = state.cartItems.map(_item => {
                    if (_item.productId === action.product.id) {
                        if(action.overwriteQty) {
                            _item.qty = action.qty
                        } else {
                            _item.qty += action.qty
                        }
                    }
                    return _item
                })
            } else {
                cartItems = state.cartItems.concat([{
                    orderId: action.orderId,
                    qty: action.qty,
                    product: action.product,
                    productId: action.product.id
                }])
            }
            return { ...state, cartItems }
        default:
            return state;
    }
};

export { loadCart, removeFromCart, addToCart, loadState, saveState, clearCart };
export default cartReducer;
