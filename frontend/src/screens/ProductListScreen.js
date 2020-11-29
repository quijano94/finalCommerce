import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createProduct, deleteProduct, listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '../constants/productConstants';

export default function ProductListScreen(props){
    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const productList = useSelector(state => state.productList);
    const{ loading, error, products} = productList;
    const productCreate = useSelector(state => state.productCreate);
    const {
        loading: loadingCreate, 
        error: errorCreate, 
        success: successCreate, 
        product:createdProduct
    } = productCreate;
    const productDelete = useSelector(state => state.productDelete);
    const {
        loading:loadingDelete, 
        error:errorDelete, 
        success: successDelete
    } = productDelete;
    const dispatch = useDispatch();
    useEffect(()=>{
        if(successCreate){
            dispatch({type: PRODUCT_CREATE_RESET});
            props.history.push(`/product/${createdProduct._id}/edit`);
        }
        if(successDelete){
            dispatch({type: PRODUCT_DELETE_RESET})
        }
        dispatch(listProducts({seller: sellerMode? userInfo._id: ''} ));
    },[dispatch,successCreate, createdProduct, props.history, successDelete, sellerMode, userInfo])

    const deleteHandler = (product) =>{
        if(window.confirm('Seguro que quieres borrar el producto?')){
            dispatch(deleteProduct(product._id));
        }
    };

    const createHandler = () =>{
        dispatch(createProduct());
    }
    return(
        <div>
            <div className="row">
                <h1>
                    Products
                </h1>
                <button type="button" className="primary" onClick={createHandler}>Create Product</button>
            </div>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

            {loadingCreate && <LoadingBox></LoadingBox>}
            {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
            {loading ? <LoadingBox></LoadingBox>:
            error ? <MessageBox variant="danger">{error}</MessageBox>:
            (
                <>
                {products.length === 0 && <MessageBox>No Products Found</MessageBox>}
                <div className="row center">
                    {
                        products.map((product) => (
                            <div key={product._id} className="product-card">
                                <div className="card-body">
                                    {/*<div className="row center tWN">
                                        <strong>ID: {product._id}</strong>
                                    </div>*/}
                                    <div className="row center">
                                        <Link to={`/product/${product._id}`}>
                                            <img className="small" src={product.image} alt={product.name} />
                                        </Link>
                                    </div>
                                    <div className="row center">
                                        <Link to={`/product/${product._id}`}>
                                            <h2>{product.name}</h2>
                                        </Link>
                                    </div>
                                    <div className="row">
                                        <div>
                                            <strong>Price: </strong>${product.price}
                                        </div>
                                        <div>
                                            <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div>
                                            <strong>Category: </strong>
                                        </div>
                                        <div>
                                            {product.category}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div>
                                            <strong>Brand: </strong>
                                        </div>
                                        <div>
                                            {product.brand}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div>
                                            <button type="button" className="small" onClick={() => props.history.push(`/product/${product._id}/edit`)}>
                                                Edit
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button" className="small" onClick={() => deleteHandler(product)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {/*<table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            //.sort((a, b) => a.price > b.price ? -1 : 1) Esta linea es para acomodar del mas caro al mas bajo por precio
                            //.sort((a, b) => a.price > b.price ? 1 : -1) Esta linea es para acomodar del mas barato al mas caro
                            products.map((product) =>(
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <button type="button" className="small" onClick={() => props.history.push(`/product/${product._id}/edit`)}>
                                            Edit
                                        </button>
                                        <button type="button" className="small" onClick={() => deleteHandler(product)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                    </table>*/}
                </>
            )
            }
        </div>
    );
}