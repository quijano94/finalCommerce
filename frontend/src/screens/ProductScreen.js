import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsProduct, saveProductReview } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_SAVE_RESET } from '../constants/productConstants';

export default function ProductScreen(props){
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;
    const productId = props.match.params.id;
    const [qty, setQty] = useState(1);
    const productDetails = useSelector( state =>  state.productDetails); 
    const{loading, error, product} = productDetails;
    const productReviewSave = useSelector(state => state.productReviewSave);
    const {success: successReviewSave,} = productReviewSave;

    useEffect(() =>{
        if(successReviewSave){
            alert('Review Submitted successfully');
            setRating(0);
            setComment('');
            dispatch({type: PRODUCT_REVIEW_SAVE_RESET});
        }
        dispatch(detailsProduct(productId));
    },[dispatch, productId, successReviewSave]);

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(saveProductReview(productId,{
            name: userInfo.name,
            rating: rating,
            comment: comment,
        }));
    }

    const addToCartHandler = () =>{
        props.history.push(`/cart/${productId}?qty=${qty}`);
    }

    return(
        <div>
        {loading ? (
            <LoadingBox></LoadingBox>
        ):
        error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) :(
            <>
                <Link to="/">Back to result</Link>
                <div className="row top">
                    <div className="col-2">
                        <img className="large" src={product.image} alt={product.name} />
                    </div>
                    <div className="col-1">
                        <ul>
                            <li>
                                <h1>{product.name}</h1>
                            </li>
                            <li>
                                <a href="#reviews">
                                    <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                                </a>
                            </li>
                            <li>
                                Price: ${product.price}
                            </li>
                            <li>
                                Description:
                                <p>{product.description}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="col-1">
                        <div className="card card-body">
                            <ul>
                                <li>
                                    Seller{' '}
                                    <h2>
                                        <Link to={`/seller/${product.seller._id}`}>{product.seller.seller.name}</Link>
                                    </h2>
                                    <Rating rating={product.seller.seller.rating} numReviews={product.seller.seller.numReviews}></Rating>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Price</div>
                                        <div className="price">${product.price}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Status</div>
                                        <div className="price">{
                                            product.countInStock > 0 
                                                ? (<span className="success">In Stock</span>)
                                                : (<span className="danger">Unavailable </span>)
                                        }</div>
                                    </div>
                                </li>
                                {
                                    product.countInStock > 0 && (
                                        <>
                                        <li>
                                            <div className="row">
                                                <div>Qty</div>
                                                <div>
                                                    <select value={qty} onChange={e => setQty(e.target.value)}>
                                                        {
                                                            [...Array(product.countInStock).keys()].map( x =>(
                                                                <option key={x+1} value={x+1} >{x+1}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <button onClick={addToCartHandler} className="primary block">Add to Cart</button>
                                        </li>
                                        </>

                                    )
                                }

                            </ul>
                        </div>
                    </div>
                </div>
                <div className="content-margined">
                    <h3>Reviews</h3>
                    {!product.reviews.length && <div>There is no reviews</div>}
                    <ul className="review" id="reviews">
                        {product.reviews.map(review =>(
                            <li key={review._id}>
                                <div>
                                    {review.name}
                                </div>
                                <div>
                                    <Rating rating={review.rating} numReviews=''></Rating>
                                </div>
                                <div>
                                    {review.createdAt.substring(0,10)}
                                </div>
                                <div>
                                    {review.comment}
                                </div>
                            </li>
                        ))}  
                        <li>
                            <h3>Write a customer review</h3>
                            {userInfo ? <form onSubmit={submitHandler}>
                                <ul className="form-container">
                                    <li>
                                        <label htmlFor="rating">Rating</label>
                                        <select name="rating" id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
                                            <option value="1">1 - Poor</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="3">3 - Good</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="5">5 - Excellent</option>
                                        </select>
                                    </li>
                                    <li>
                                        <label htmlFor="comment">Comment</label>
                                        <textarea name="comment" value={comment} onChange={(e) => setComment(e.target.value)}>

                                        </textarea>
                                    </li>
                                    <li>
                                        <button type="submit" className="button primary">Submit</button>
                                    </li>
                                </ul>
                            </form>: 
                            <div>
                                Please <Link to="/signin">Sign-In</Link> to write a review.
                            </div>
                            }
                        </li>   
                    </ul>
                </div>
            </> 
        )
        }
        
    </div>
        
    );
}