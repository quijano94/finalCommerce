import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';
import { prices, ratings } from '../util';

export default function SearchScreen(props){
    const { pageNumber =  1, name = 'all', category = 'all', min = 0, max = 1000000, rating = 0, order = 'newest'} = useParams();
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const {loading, error, products, page, pages} = productList;
    const productCategoryList = useSelector(state => state.productCategoryList);
    const {loading:loadingCategories, error:errorCategories, categories} = productCategoryList;

    const getFilterUrl = (filter) =>{
        const filterPage = filter.page || pageNumber;
        const filterCategory = filter.category || category;
        const filterName = filter.name || name;
        const filterRating = filter.rating ? filter.rating : filter.rating === 0 ? 0 : rating;
        const sortOrder = filter.order || order;
        const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
        const filterMax = filter.max ? filter.max : filter.max === 1000000 ? 1000000 : max;
        return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
    }

    useEffect(() => {
        dispatch(listProducts({
            pageNumber,
            name: name !== 'all' ? name: '', 
            category: category !== 'all' ? category: '',
            min,
            max,
            rating,
            order,
         }));
    },[dispatch,name, category, min, max, rating,order, pageNumber]);

    return(
        <div>
            <div className="row">
                {
                loading ? (<LoadingBox></LoadingBox>)
                : 
                error ? (<MessageBox variant="danger">{error}</MessageBox>)
                : 
                (
                    <div>
                        {products.length} Results 
                    </div>
                )
                }
                <div>
                    Sort by {' '}
                    <select value={order} onChange={(e) =>{props.history.push(getFilterUrl({order: e.target.value}));}}>
                        <option value="newest">Newest Arrivals</option>
                        <option value="lowest">Price: Low to High</option>
                        <option value="highest">Price: High to Low</option>
                        <option value="toprated">Avg. Customer Review</option>
                    </select>
                </div>
            </div>
            <div className="row top">
                <div className="col-1">
                    <h3>Department</h3>
                    <div>
                        {
                        loadingCategories ? (<LoadingBox></LoadingBox>)
                        : 
                        errorCategories ? (<MessageBox variant="danger">{errorCategories}</MessageBox>)
                        : 
                        (
                            <ul>
                                <li>
                                    <Link className={'all' === category ?  'active': ''} to={getFilterUrl({category:'all'})}>Any</Link>
                                </li>
                                {categories.map(c => (
                                    <li key ={c}>
                                        <Link className={c === category ?  'active': ''} to={getFilterUrl({category:c})}>{c}</Link>
                                    </li>
                                ))}
                            </ul>
                        )
                        }
                    </div>
                    <div>
                        <h3>Price</h3>
                        <ul>
                            {
                                prices.map((p) => (
                                    <li key={p.name}>
                                        <Link to={getFilterUrl({min: p.min, max: p.max})} className={`${p.min}-${p.max}` === `${min}-${max}` ? 'active' : ''}>{p.name}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div> 
                    <div>
                        <h3>Avg. Customer Review</h3>
                        <ul>
                            {
                                ratings.map((r) => (
                                    <li key={r.rating}>
                                        <Link to={getFilterUrl({rating: r.rating})} className={`${r.rating}` === rating ? 'active' : ''}>
                                            <Rating caption={' & up'} rating={r.rating}></Rating>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>                   
                </div>
                <div className="col-3">
                    {
                    loading ? (<LoadingBox></LoadingBox>)
                    : 
                    error ? (<MessageBox variant="danger">{error}</MessageBox>)
                    : 
                    (
                        <>
                        {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
                        <div className="row center">
                            {products.map(product =>(
                                <Product key={product._id} product={product}></Product>
                            ))
                            }    
                        </div>
                        <div className="row center pagination">
                            {
                                [...Array(pages).keys()].map(x => (
                                    <Link className={x+1 === page ? 'active' : ''} kye={x+1} to={getFilterUrl({page: x+1})}>{x+1}</Link>
                                ))
                            }
                        </div>
                        </>
                    )
                    }
                </div>
            </div>
        </div>
    )
}