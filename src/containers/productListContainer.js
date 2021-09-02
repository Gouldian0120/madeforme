import React from 'react';
import { connect } from 'react-redux';
import { selectProduct, deSelectProduct } from '../reducers/productsReducer';
import { addToCart  } from '../reducers/cartReducer';


import { ProductContainer, ProductRow, Product } from '../components/products/productsList';
import ProductDetails from '../components/products/productdetails';

class ProductListContainer extends React.Component {
	constructor({ products, activeUser, addtoCart, selectProduct, deselectProduct }) {
		super();
	}

	render() {
		if (!this.props.products) return null;
		return (
			(!this.props.selectedProduct) ?
				<div className="container">
					<ProductContainer
						products={this.props.products}
						activeUser={this.props.activeUser}
						addtoCart={this.props.addtoCart}
						selectProduct={this.props.selectProduct} />
				</div>
				: <div className="container">
					<ProductDetails
						selectedProduct={this.props.selectedProduct}
						activeUser={this.props.activeUser}
						addtoCart={this.props.addtoCart} />
				</div>
		);
	}
}


const mapDispatchToProps = (dispatch) => (
	{
		addtoCart: (orderId, product, qty) => dispatch(addToCart(orderId, product, qty)),
		selectProduct: (product) => dispatch(selectProduct(product)),
		deSelectProduct: () => dispatch(deSelectProduct())
	}
);

const mapStateToProps = (state) => {
	return (
		{
			activeUser: state.auth.user, //changed to activeUser
			products: state.products.list,
			selectedProduct: state.products.selectedProduct
		}
	);
};


export default connect(mapStateToProps, mapDispatchToProps)(ProductListContainer);
