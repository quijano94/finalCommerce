import React from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

export default function PrivateRoute({component: Component, ...rest}){

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo, signout} = userSignin;

    return(
        <Route {...rest} render={(props) => userInfo? (<Component {...props}></Component>): 
    (
        <Redirect to={signout
            ? '/signin?message=You signed out successfully.'
            : '/signin?message=Error. Please signin to see this screen.'}/>
    )}
    ></Route>
    );
}