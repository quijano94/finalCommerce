import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { changePassword } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_CHANGE_PASSWORD_RESET } from '../constants/userConstants';

export default function ChangePasswordScreen(props){

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const redirect = props.location.search? props.location.search.split('=')[1]: '/';

    const userChangePassword = useSelector((state) => state.userChangePassword);
    const { loading, success, error } = userChangePassword;

    const submitHandler = (e) =>{
        e.preventDefault();
        if(email === ''){
            alert('Email is empty');
        }else if(password !== confirmPassword){
            alert('Password and confirm password are not match');
        }else if(window.confirm('Are your sure you want to change your password?')){
            dispatch(changePassword(email,password));
        }    
    }

    useEffect(() =>{
        if(success){
            dispatch({type: USER_CHANGE_PASSWORD_RESET});
            props.history.push(`/signin?redirect=${redirect}`);
        }
    },[props.history, redirect, success, dispatch])

    return(
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>
                        Change Password
                    </h1>
                </div>
                {loading && <div><LoadingBox></LoadingBox></div>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                {success && <MessageBox variant="success">Password Changed Successfully</MessageBox>}
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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" placeholder="Enter confirm password" required onChange={e => setConfirmPassword(e.target.value)}>
                    </input>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">Change Password</button>
                </div>
                <div>
                    <label />
                    <div>
                        Already have an account?{' '}
                        <Link to={`/signin?redirect=${redirect}`}>Sign-In.</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}