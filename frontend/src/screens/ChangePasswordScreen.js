import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

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
        }else{
            dispatch(changePassword(email,password));
        }
    }

    useEffect(() =>{
        //Falta depurar aqui, ya despues del primer succes ya no jala. debo de reiniciar
        if(success){
            props.history.push(`/signin?redirect=${redirect}`);
        }
    },[props.history, redirect, success])

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
            </form>
        </div>
    );
}