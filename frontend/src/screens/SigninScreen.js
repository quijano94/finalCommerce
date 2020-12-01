import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SigninScreen(props){

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //const redirect = props.location.search? props.location.search.split('=')[1]: '/';
    const redirect = props.location.search && props.location.search.indexOf('redirect') >= 0 ? props.location.search.split('=')[1] : '/';
    const message = props.location.search && props.location.search.indexOf('message') >= 0 ? props.location.search.split('=')[1] : '';

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo, loading, error } = userSignin;

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(signin(email,password));
    };

    useEffect(() =>{
        if(userInfo){
            props.history.push(redirect);
        }
    },[props.history, redirect, userInfo])

    return(
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>
                        Sign In
                    </h1>
                </div>
                {loading && <div><LoadingBox></LoadingBox></div>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                {message && (<MessageBox variant="danger">{message.replace(/%20/g, ' ')}</MessageBox> )}
                <div>
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email" placeholder="Enter email" required onChange={e => setEmail(e.target.value)}>
                    </input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter password" required onChange={e => setPassword(e.target.value)}>
                    </input>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">Sign In</button>
                </div>
                <div>
                    <label />
                    <div>
                        New customer?{' '}
                        <Link to={`/register?redirect=${redirect}`}>Create your account.</Link>
                    </div>
                    <div>
                        Forgot your password?{' '}
                        <Link to={`/changePassword?redirect=${redirect}`}>Change it.</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}