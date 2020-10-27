import React from 'react';

export default function CheckoutSteps(props){
    return(
        <div className="row checkout-steps">
            <div className={props.step1 ? 'active' : ''}>
                Sesión
            </div>
            <div className={props.step2 ? 'active' : ''}>
                Carrito
            </div>
            <div className={props.step3 ? 'active' : ''}>
                Pago
            </div>
            <div className={props.step4 ? 'active' : ''}>
                Orden
            </div>
        </div>
    );
}