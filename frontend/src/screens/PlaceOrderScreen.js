import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';

export default function PlaceOrderScreen(props){

    const [blockOrder, setBlockOrder] = useState(false);
    const cart = useSelector(state => state.cart);
    const userSignin = useSelector(state => state.userSignin);
    const productDetails = useSelector(state => state.productDetails);
    const {product: productDetail} = productDetails;

    /*Condiciones para evitar acceso por URL*/
    if(!userSignin.userInfo){ //No esta logeado, lo mando a logearse
        props.history.push('/signin');
    }else if(cart.cartItems.length === 0){ //Su carrito esta vacio, lo mando a que almacene algo
        props.history.push('/cart');
        //Su info no esta llena, lo mando a llenarla
    }else if(!cart.shippingAddress.address || !cart.shippingAddress.fullName || !cart.shippingAddress.city || !cart.shippingAddress.postalCode || !cart.shippingAddress.country){
        props.history.push('/shipping');
    }else if(!cart.paymentMethod){ //No tiene  metodo de pago seleccionado, lo mando a que seleccione.
        props.history.push('/payment');
    }

    const orderCreate = useSelector(state => state.orderCreate);
    const {loading, success, error, order} = orderCreate;
    const userAddressMap = useSelector((state) => state.userAddressMap);
    const { address: addressMap } = userAddressMap;

    const toPrice = (num) => Number(num.toFixed(2)); //Example: 5.123 => "5.12" => 5.12
    cart.itemsPrice = toPrice(
        cart.cartItems.reduce((a,c) => a + c.qty * c.price,0)
    );

    cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
    cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
    const dispatch = useDispatch();

    const checkAvailableProducts = async () =>{
        cart.cartItems.map(async(item) =>{
            console.log("ID: "+item.product+" Name: "+ item.name + " Qty: "+item.qty);
            try {
                await Axios.get(`/api/products/${item.product}`)
                .then((response) =>{
                    console.log("El producto se llama: "+item.name+", tú quieres: "+item.qty+" y hay en stock: "+response.data.countInStock);
                    if(response.data.countInStock < item.qty){
                        console.log("No hay en stock");
                        setBlockOrder(true);
                    }else{
                        console.log("Si hay para comprar el producto: "+response.data.name);
                    }
                }).catch((error)=>{
                    console.log(error);
                }); 
            } catch (error) {
                console.log(error);
            }
        })
    };

    const updateStockProducts = async () =>{
        cart.cartItems.map(async(item) =>{
            console.log("ID: "+item.product+" Name: "+ item.name + " Qty: "+item.qty);
            try {
                await Axios.get(`/api/products/${item.product}`)
                .then(async(response) =>{
                    console.log("El producto se llama: "+item.name+", tú quieres: "+item.qty+" y hay en stock: "+response.data.countInStock);
                    const newProductStock = response.data.countInStock - item.qty;
                    console.log("En el producto: "+item.name+" quedan ahora: "+newProductStock);

                    try {
                        await Axios.put(`/api/products/${item.product}`, {
                            //_id: productId,
                            name: productDetail.name,
                            price: productDetail.price,
                            image: productDetail.image,
                            category: productDetail.category,
                            brand: productDetail.brand,
                            countInStock: newProductStock,
                            description: productDetail.description,
                        },{
                                headers:{Authorization: `Bearer ${userSignin.userInfo.token}`},
                        }).then((response) =>{

                        }).catch((error) =>{
                            console.log(error);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                    /*dispatch(updateProductStock({
                        _id: item.product,
                        countInStock: newProductStock,
                    }));*/
                }).catch((error)=>{
                    console.log(error);
                }); 
            } catch (error) {
                console.log(error);
            }
        })
    };


    const placeOrderHandler = () =>{
        checkAvailableProducts();
        if(blockOrder){
            alert('Product(s) unavailable');
            props.history.push('/cart');
        }else if(window.confirm('Are your sure you want create the order?')){
            setBlockOrder(false);
            updateStockProducts();
            dispatch(createOrder({...cart, orderItems: cart.cartItems}));
        }      
    };

    useEffect(() => {
        if(success){
            props.history.push(`/order/${order._id}`);
            dispatch({type: ORDER_CREATE_RESET});
        }
    }, [dispatch, order, props.history, success]);

    return(
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>
                                    Shipping
                                </h2>
                                <p>
                                    <strong>Name:</strong>{cart.shippingAddress.fullName} <br/>
                                    <strong>Address:</strong>
                                    {addressMap ?
                                        <>
                                        {' '}
                                        {cart.shippingAddress.address}
                                        </>
                                     :
                                        <>
                                        {' '}
                                        {cart.shippingAddress.address},
                                        {cart.shippingAddress.city},
                                        {cart.shippingAddress.postalCode},
                                        {cart.shippingAddress.country}
                                        </>
                                    }
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>
                                    Payment
                                </h2>
                                <p>
                                    <strong>Method:</strong>{cart.paymentMethod}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>
                                    Order Items
                                </h2>
                                <ul>
                                    {
                                        cart.cartItems.map((item) =>(
                                            <li key={item.product}>
                                                <div className="row">
                                                    <div>
                                                        <img src={item.image} alt={item.name} className="small" />
                                                    </div>
                                                    <div className="min-30">
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </div>
                                                    <div>
                                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                            <li>
                                <h2>Order Summary</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Items</div>
                                    <div>${cart.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Shipping</div>
                                    <div>${cart.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Tax</div>
                                    <div>${cart.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>
                                        <strong>Order Total</strong>
                                    </div>
                                    <div>
                                        <strong>${cart.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <button type="button" onClick={placeOrderHandler} className="primary block" disabled={cart.cartItems.length === 0 || blockOrder}>
                                    Place Order
                                </button>
                            </li>
                            { loading && <LoadingBox></LoadingBox> }
                            { error && <MessageBox variant="danger">{error}</MessageBox> }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};