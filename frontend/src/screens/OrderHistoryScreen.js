import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrderMine } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import WhatsApp from 'react-whatsapp';

export default function OrderHistoryScreen(props){

    const numberWhatsapp = "+522292290974";
    const orderMineList = useSelector(state => state.orderMineList);
    const {loading, error, orders} = orderMineList;
    const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(listOrderMine());
    }, [dispatch]);

    return(
        <div>
            <h1>
                Order History
            </h1>
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
                                            {
                                                !order.isDelivered &&
                                                <WhatsApp className="small" number={numberWhatsapp} message={`Hola, me gustaria sabe el estado de mi pedido con número: *${order._id}* a nombre de: *${order.shippingAddress.fullName}*, con fecha de compra del: *${order.createdAt.substring(0,10)}*`} >Ask for me!</WhatsApp>                                         
                                            }
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
    );
};