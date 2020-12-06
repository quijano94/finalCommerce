import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET } from '../constants/userConstants';

export default function UserListScreen(props){

    const userList = useSelector(state => state.userList);
    const {loading, error, users} = userList;

    const userDelete = useSelector(state => state.userDelete);
    const {loading: loadingDelete, error:errorDelete, success:successDelete} = userDelete;

    const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(listUsers());
        dispatch({type: USER_DETAILS_RESET});
    }, [dispatch, successDelete]);

    const deleteHandler = (user) =>{
        if(window.confirm('Are your sure?')){
            dispatch(deleteUser(user._id));
        }
    }
    return(
        <div>
            <h1>Users</h1>
            { loadingDelete && (<LoadingBox></LoadingBox>) }
            { errorDelete && (<MessageBox variant="danger">{errorDelete}</MessageBox>) }
            { successDelete && (<MessageBox variant="success">User Deleted Successfully</MessageBox>) }
            {
                loading ? (<LoadingBox></LoadingBox>)
                :
                error? (<MessageBox variant="danger">{error}</MessageBox>)
                :
                (
                    <>
                    {users.length === 0 && <MessageBox>No Users Found</MessageBox>}
                    <div className="row center">
                        {
                            users.map((user) => (
                                <div key={user._id} className="order-history-card">
                                    <div className="card-body-history">
                                        <div className="row center price">
                                            <strong>USER</strong>
                                        </div>
                                        <div className="row center">
                                            <strong><i>{user._id}</i></strong>
                                        </div>
                                        <div className="row start">
                                            <strong>NAME: </strong> {user.name}
                                        </div>
                                        <div className="row start">
                                            <strong>EMAIL: </strong> {user.email}
                                        </div>
                                        <div className="row start">
                                            <strong>SELLER: </strong> {user.isSeller ? 'SI' : 'NO'}
                                        </div>
                                        <div className="row start">
                                            <strong>ADMIN: </strong> {user.isAdmin ? 'SI': 'NO'}
                                        </div>
                                        <div className="row">
                                            <div>
                                                <button type="button" className="small" onClick={() => props.history.push(`/user/${user._id}/edit`)}>Edit</button>
                                            </div>
                                            <div>
                                                <button type="button" className="small" onClick={() => deleteHandler(user)}>Delete</button>
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
    )
}