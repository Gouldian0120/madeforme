import React, { Component} from 'react';
import { render } from 'react-dom';
import App from './App';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import ProductsPage from './ProductsPage';
import { Provider } from 'react-redux';
import store from './store';
import Home from './Home';
import LoginPage from './containers/LoginPage';
import CartPage from './containers/CartPage';
import AddProduct from './containers/AddProduct';


const root = document.getElementById('root');

const routes = (
  <Provider store = {store }>
    <Router history={ hashHistory }>
      <Route path='/' component={ App }>
        <IndexRoute component={ Home } />
        <Route path='products' component={ProductsPage} />
        <Route path='login' component={LoginPage} />
        <Route path='cart' component={CartPage} />
        <Route path='product' component={AddProduct} />
      </Route>
    </Router>
  </Provider>
);


render(routes, root);
