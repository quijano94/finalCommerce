import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen(props){

    const userSignin = useSelector((state)  => state.userSignin);
    const {userInfo} = userSignin;
    const cart = useSelector((state) => state.cart);
    const {
        shippingAddress, 
        cartItems
    } = cart;
    const [lat, setLat] = useState(shippingAddress.lat);
    const [lng, setLng] = useState(shippingAddress.lng);
    const userAddressMap = useSelector((state) => state.userAddressMap);
    const { address: addressMap } = userAddressMap;

    /* Condicion para no accesa por la URL*/
    if(!userInfo){ //No tiene un logeo, lo mando al login
        props.history.push('/signin');
    }else if(cartItems.length === 0){ //El carrito esta vacio, lo mando al carrito
        props.history.push('/cart');
    }

    
    const [fullName, setFullName] = useState(shippingAddress.fullName);
    const [address, setAddres] = useState(addressMap ? addressMap.address : shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const dispatch = useDispatch();
    const submitHandler = (e) =>{
        e.preventDefault();
        const newLat = addressMap ? addressMap.lat : lat;
        const newLng = addressMap ? addressMap.lng : lng;
        if(addressMap){
            setLat(addressMap.lat);
            setLng(addressMap.lng);   
        }

        let moveOn = true;
        if(!newLat || !newLng){
            moveOn = window.confirm('You did not set your location on map. Continue?');
        }

        if(moveOn){
            dispatch(saveShippingAddress({fullName, address, city, postalCode, country, lat: newLat, lng: newLng}));
            props.history.push('/payment');
        }
    };

    const chooseOnMap = () =>{
        if(!addressMap){
            if(window.confirm('If you choose this option, you can not put your address manually')){
                dispatch(saveShippingAddress({fullName, address, city, postalCode, country, lat, lng}));
                props.history.push('/map');
            }  
        }else{
            dispatch(saveShippingAddress({fullName, address, city, postalCode, country, lat, lng}));
            props.history.push('/map');
        }
          
    }

    useEffect(() => {
        if(addressMap){
            setAddres(addressMap.address);
            setCity('.');
            setPostalCode('.');
            setCountry('.'); 
        }
    }, [dispatch, addressMap]);

    return(
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Shipping Address</h1>
                </div>
                <div>
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" placeholder="Enter full name" value={fullName} required onChange={(e) => setFullName(e.target.value)} ></input>
                </div>
                {
                    addressMap ?
                    <div>
                        <label htmlFor="address">Address From Google</label>
                        <input type="text" id="address" placeholder="Enter address" value={address} required  onChange={(e) => setAddres(e.target.value)} ></input>
                    </div>
                    :(
                        <>
                        <div>
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" placeholder="Enter address" value={address} required  onChange={(e) => setAddres(e.target.value)} ></input>
                        </div>
                        <div>
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" placeholder="Enter city" value={city} required onChange={(e) => setCity(e.target.value)} ></input>
                        </div>
                        <div>
                            <label htmlFor="postalCode">Postal Code</label>
                            <input type="text" id="postalCode" placeholder="Enter postal code" value={postalCode} required onChange={(e) => setPostalCode(e.target.value)} ></input>
                        </div>
                        <div>
                            <label htmlFor="country">Country</label>
                            <input type="text" id="country" placeholder="Enter country" value={country} required onChange={(e) => setCountry(e.target.value)} ></input>
                        </div>
                        </>
                    )
                    
                }
                
                
                <div>
                    <label htmlFor="chooseMap">Location</label>
                    <button type="button" onClick={chooseOnMap}>Choose On Map</button>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">Continue</button>
                </div>
            </form>
        </div>
    );
}