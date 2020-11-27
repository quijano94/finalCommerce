import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { signout } from './actions/userActions';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import { listProducts } from './actions/productActions';
import UserListScreen from './screens/UserListScreen';
import CookieConsent/*, { Cookies }*/ from "react-cookie-consent";
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';


function App() {

    //const extractCookie = Cookies.get("acceptTerms");
    //console.log(extractCookie);
    const dispatch = useDispatch();
    const cart = useSelector( state => state.cart);
    const {cartItems} = cart;

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const openMenu = () =>{
        document.querySelector('.sidebar').classList.add('open');
    };

    const closeMenu = () =>{
        document.querySelector('.sidebar').classList.remove('open');
    };

    const category = '';
    const[searchKeyword, setSearchKeyword] = useState('');

    const signoutHandler = () =>{
        dispatch(signout());
    }

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(listProducts(category, searchKeyword));
    };
  return ( 
      <BrowserRouter>
    <div className="grid-container">
            <header className="row">
                <div>
                    <button className="open-sidebar" onClick={openMenu}>&#9776;</button>
                    <Link className="brand" to="/">amazona</Link>
                </div>
                <div>
                    <form className="search" onSubmit={submitHandler}>
                        <div className="row">
                            <input name="searchKeyword" onChange={(e) => setSearchKeyword(e.target.value)}></input>
                            <button className="primary" type="submit"><i className="fa fa-search"></i></button>
                        </div>
                    </form>
                </div>
                <div>
                    <Link to="/cart">Cart
                    {cartItems.length > 0 && (
                        <span className="badge">
                            {
                                cartItems.length
                                //TODO: Implementar esta linea para que cuente cuando objetos llevan de todos los productos.
                                // cartItems.reduce((a,c) => a + c.qty,0)
                            }
                        </span>
                    )}
                    </Link>
                    {
                        userInfo ?(
                            <div className="dropdown">
                                <Link to="#">{userInfo.name} <i className="fa fa-caret-down"></i></Link>
                                <ul className="dropdown-content">
                                    <li>
                                        <Link to="/profile">Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/orderhistory">Order History</Link>
                                    </li>
                                    <li>
                                        <Link to="#signout" onClick={signoutHandler}>Sign Out</Link>
                                    </li>
                                </ul>
                            </div>
                        ): (
                            <Link to="/signin">Sign-In</Link>
                        )
                    }
                    {
                        userInfo && userInfo.isSeller && (
                            <div className="dropdown">
                                <Link to="#seller">Seller {' '} <i className="fa fa-caret-down"></i></Link>
                                <ul className="dropdown-content">
                                    <li>
                                        <Link to="/productlist/seller">Products</Link>
                                    </li>
                                    <li>
                                        <Link to="/orderlist/seller">Orders</Link>
                                    </li>
                                </ul>
                            </div>
                        )
                    }
                    {
                        userInfo && userInfo.isAdmin && (
                            <div className="dropdown">
                                <Link to="#admin">Admin {' '} <i className="fa fa-caret-down"></i></Link>
                                <ul className="dropdown-content">
                                    <li>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </li>
                                    <li>
                                        <Link to="/productlist">Products</Link>
                                    </li>
                                    <li>
                                        <Link to="/orderlist">Orders</Link>
                                    </li>
                                    <li>
                                        <Link to="/userlist">Users</Link>
                                    </li>
                                </ul>
                            </div>
                        )
                    }
                    
                </div>
            </header>
            <aside className="sidebar">
                    <h3>Hola, {userInfo ? userInfo.name : (<Link to="/signin">Identificate</Link>)}</h3>
                    <button className="sidebar-close-button" onClick={closeMenu}>
                        x
                    </button>
                    <hr></hr>
                    <ul className="categories">
                        <li>
                            <Link to="/category/Pants">Pants</Link>
                        </li>
                        <li>
                            <Link to="/category/Shirts">Shirts</Link>
                        </li>
                    </ul>
            </aside>
            <main>
                {/*Rutas privadas que no se pueden accessar sin un logeo*/}
                <PrivateRoute path="/placeorder" component={PlaceOrderScreen} ></PrivateRoute>
                <PrivateRoute path="/payment" component={PaymentMethodScreen} ></PrivateRoute>
                <PrivateRoute path="/shipping" component={ShippingAddressScreen} ></PrivateRoute>
                <PrivateRoute exact path="/profile" component={ProfileScreen} ></PrivateRoute>
                <PrivateRoute path="/orderhistory" component={OrderHistoryScreen} ></PrivateRoute>
                <PrivateRoute path="/order/:id" component={OrderScreen} ></PrivateRoute>

                {/*Rutas de administrador para que exista logeo exclusivo de admin*/}
                <AdminRoute path="/productlist" component={ProductListScreen} exact></AdminRoute> 
                <AdminRoute path="/orderlist" component={OrderListScreen} exact></AdminRoute>  
                <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute> 
                <AdminRoute path="/user/:id/edit" component={UserEditScreen}></AdminRoute>
                <AdminRoute exact path="/product/:id/edit" component={ProductEditScreen} ></AdminRoute>  

                {/*Rutas de venderor para que exista un logeo */}
                <SellerRoute path="/productlist/seller" component={ProductListScreen}></SellerRoute>
                <SellerRoute path="/orderlist/seller" component={OrderListScreen}></SellerRoute>  
                

                {/*Rutas que pueden acceder sin logeo o sin información pasada*/}
                <Route exact path="/product/:id" component={ProductScreen} ></Route>
                <Route path="/register" component={RegisterScreen} ></Route>
                <Route path="/signin" component={SigninScreen} ></Route>
                <Route path="/cart/:id?" component={CartScreen} ></Route>
                <Route path="/category/:id" component={HomeScreen} exact></Route>
                <Route path="/" component={HomeScreen} exact></Route>
                
                
                
            </main>
            <footer className="row center">
                Todos los derechos reservados
            </footer>
            <CookieConsent
                cookieName="acceptTerms"
                expires={10}
                style={{
                    background: "#a4a4a4"
                }}
                buttonStyle={{
                    background: "#f0c040",
                }}
                buttonText="Entendido"
                onAccept={() => {
                    //localStorage.setItem("acceptCookies", 'true');
                }}
            >
                Éste sitio web usa cookies, si permanece aquí acepta su uso. Puede leer más sobre el uso de cookies en nuestra <Link to="/politica">política de privacidad</Link>.
            </CookieConsent>
        </div>
        </BrowserRouter>
  );
}

export default App;
