import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

export default function OrderListScreen(props){
    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;
    const orderList = useSelector(state => state.orderList);
    const {loading, error, orders} = orderList;
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const orderDelete = useSelector(state => state.orderDelete);
    const {loading: loadingDelete, error: errorDelete, success:successDelete} = orderDelete;
    const dispatch = useDispatch();
    useEffect(() =>{
        dispatch({type: ORDER_DELETE_RESET});
        dispatch(listOrders({seller: sellerMode? userInfo._id: ''}));
    },[dispatch, successDelete, sellerMode, userInfo]);

    const deleteHandler = (order) =>{
        if(window.confirm('Are you sure to delete?')){
            dispatch(deleteOrder(order._id));
        }
    };

    return(
        <div>
            <div>
                <h1>
                    Orders
                </h1>
                {loadingDelete && <LoadingBox></LoadingBox>}
                {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
                {loading ? (<LoadingBox></LoadingBox>):
                error? <MessageBox variant="danger">{error}</MessageBox>:
                (
                    <>
                    {orders.length === 0 && <MessageBox>No Orders Found</MessageBox>}
                    <div className="row center">
                        {
                            orders.map((order) =>(
                                <div key={order._id} className="order-history-card">
                                    <div className="card-body-history">
                                        <div className="row center price">
                                            <strong>ORDER</strong>
                                        </div>
                                        <div className="row center">
                                            <strong><i>{order._id}</i></strong>
                                        </div>
                                        <div className="row start">
                                            <strong>USER: </strong> {order.user ? order.user.name : 'Deleted User'}
                                        </div>
                                        <div className="row start">
                                            <strong>DATE: </strong> {order.createdAt.substring(0,10)}
                                        </div>
                                        <div className="row start">
                                            <strong>TOTAL: </strong> {order.totalPrice.toFixed(2)}
                                        </div>
                                        <div className="row start">
                                            <strong>PAID: </strong> {order.isPaid? order.paidAt.substring(0,10): 'No'}
                                        </div>
                                        <div className="row start">
                                            <strong>DELIVERED: </strong> {order.isDelivered? order.deliveredAt.substring(0,10): 'No'}
                                        </div>
                                        <div className="row">
                                            <div>
                                                <button type="button" className="small" onClick={() => {props.history.push(`/order/${order._id}`)}}>Details</button>
                                            </div>
                                            <div>
                                                <button type="button" className="small" onClick={() => deleteHandler(order)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    
                    </>
                )
                }
            </div>
        </div>
    );
}