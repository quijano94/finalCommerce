import React, { useEffect, useState,} from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

export default function HomeScreen(props){

    const category = props.match.params.id ? props.match.params.id : '';

    const[searchKeyword, setSearchKeyword] = useState('');
    const[sortOrder, setSortOder] = useState('');
    
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const {loading, error, products} = productList;

    useEffect(() =>{
        dispatch(listProducts(category));
    }, [dispatch, category]);

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(listProducts(category, searchKeyword, sortOrder));
    };

    const sortHandler = (e) =>{
        setSortOder(e.target.value);
        dispatch(listProducts(category, searchKeyword, sortOrder));
    }

    return(
        <>
            {category && (<h2>{category}</h2>)}

            <ul className="filter">
                {/*<li>
                    <form onSubmit={submitHandler}>
                        <input name="searchKeyword" onChange={(e) => setSearchKeyword(e.target.value)}></input>
                        <button type="submit">Search</button>
                    </form>
                </li>*/}
                <li>
                    Sort By {' '}
                    <select name="sortOrder" onChange={sortHandler}>
                        <option value="">Newest</option>
                        <option value="lowest">Lowest</option>
                        <option value="highest">Highest</option>
                    </select>
                </li>
            </ul>
            {loading ? (
                <LoadingBox></LoadingBox>
            ):
            error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) :(
                <div className="row center">
                    {products.map(product =>(
                        <Product key={product._id} product={product}></Product>
                        ))
                    }    
                </div>
            )
            }        
        </>
        
    );
}