import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { createProduct, deleteProduct, listProductCategories, listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '../constants/productConstants';

export default function ProductListScreen(props){
    const { pageNumber = 1, } = useParams();
    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const productList = useSelector(state => state.productList);
    const{ loading, error, products, page, pages} = productList;
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
        dispatch(listProductCategories());
        dispatch(listProducts({seller: sellerMode? userInfo._id: '', pageNumber} ));
    },[dispatch,successCreate, createdProduct, props.history, successDelete, sellerMode, userInfo, pageNumber])

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
                                    <div className="row center">
                                        <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                                    </div>
                                    <div className="row">
                                        <div>
                                            ${product.price}
                                        </div>
                                        <div>
                                            <strong>Stock: </strong>{product.countInStock}
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
                <div className="row center pagination">
                    {
                        [...Array(pages).keys()].map(x => (
                            <Link className={x+1 === page ? 'active' : ''} kye={x+1} to={`/productlist/pageNumber/${x+1}`}>{x+1}</Link>
                        ))
                    }
                </div>
                </>
            )
            }
        </div>
    );
}