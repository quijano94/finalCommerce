import React, { useEffect, /*useState,*/} from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Carousel} from 'react-responsive-carousel';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { listTopSellers } from '../actions/userActions';
import { Link } from 'react-router-dom';

export default function HomeScreen(props){

    const category = props.match.params.id ? props.match.params.id : '';
    const sellerMode = '';

   /* const[searchKeyword, setSearchKeyword] = useState('');
    const[sortOrder, setSortOder] = useState('');*/
    
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const {loading, error, products} = productList;

    const userTopSellersList = useSelector(state => state.userTopSellersList);
    const {loading: loadingSellers, error:errorSellers, users:sellers} = userTopSellersList;

    useEffect(() =>{
        dispatch(listProducts(sellerMode,category));
        dispatch(listTopSellers());
    }, [dispatch, category]);

    /*const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(listProducts(category, searchKeyword, sortOrder));
    };

    const sortHandler = (e) =>{
        setSortOder(e.target.value);
        dispatch(listProducts(category, searchKeyword, sortOrder));
    }*/

    return(
        <>
            {category && (<h2>{category}</h2>)}

            <h2>Top Sellers</h2>
            {loadingSellers ? (
                <LoadingBox></LoadingBox>
            ):
            errorSellers ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) :(
                <>
                {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
                <Carousel showArrows autoPlay showThumbs={false}>
                    {sellers.map((seller) => (
                        <div key={seller._id}>
                            <Link to={`/seller/${seller._id}`}>
                                <img src={seller.seller.logo} alt={seller.seller.name}/>
                                <p className="legend">{seller.seller.name}</p>
                            </Link>
                        </div>
                    ))}
                </Carousel>
                </>
            )
            } 

            
            <h2>Featured Products</h2>

            {/*<ul className="filter">
                <li>
                    <form onSubmit={submitHandler}>
                        <input name="searchKeyword" onChange={(e) => setSearchKeyword(e.target.value)}></input>
                        <button type="submit">Search</button>
                    </form>
                </li>
                <li>
                    Sort By {' '}
                    <select name="sortOrder" onChange={sortHandler}>
                        <option value="">Newest</option>
                        <option value="lowest">Lowest</option>
                        <option value="highest">Highest</option>
                    </select>
                </li>
            </ul>*/}
            {loading ? (
                <LoadingBox></LoadingBox>
            ):
            error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) :(
                <>
                {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
                <div className="row center">
                    {products.map(product =>(
                        <Product key={product._id} product={product}></Product>
                        ))
                    }    
                </div>
                </>
                
            )
            }        
        </>
        
    );
}