import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import {isAdmin, isAuth, isSellerOrAdmin} from '../util.js';

const productRouter = express();

//Mostrart todos los productos que tambien funciona el filtaro de rango, y por palabras.
productRouter.get('/', expressAsyncHandler(async(req,res)=>{
    const seller = req.query.seller || '';
    const sellerFilter  = seller ? {seller} : {};
    const category = req.query.category || '';
    const categoryFilter  = category ? {category} : {};
    const name = req.query.name || '';
    const nameFilter  = name ? {
        name :{
            $regex: name,
            $options: 'i',
        }
    } : {};

    /*const category = req.query.category ? {category: req.query.category} : {};
    const searchKeyword  = req.query.searchKeyword ? {
        name: {
            $regex: req.query.searchKeyword,
            $options: 'i',
        }
    } : {};
    const sortOrder = req.query.sortOrder ? 
        (req.query.sortOrder ===  'lowest' ? {price:-1}:{price:1})
        :{ _id:-1};
    const products = await Product.find({...sellerFilter,...category, ...searchKeyword}).sort(sortOrder).populate('seller','seller.name seller.logo');
    */ 

   const products = await Product.find({...sellerFilter,...nameFilter,...categoryFilter}).populate('seller','seller.name seller.logo');
    res.send(products);
}));

//Metodo para mostrar las categorias
productRouter.get('/categories', expressAsyncHandler(async(req,res) =>{
    const categories = await Product.find().distinct('category');
    res.send(categories);
}));

//Agregar productos cuando se muda de servidor y es nuevo.
productRouter.get('/seed', expressAsyncHandler(async(req,res) =>{
    // await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({createdProducts});
}));

//Mostrar el producto
productRouter.get('/:id', expressAsyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id).populate('seller','seller.name seller.logo seller.rating seller.numReviews');
    if(product){
        res.send(product);
    }else{
        res.status(500).send({message: 'Product not found.'});
    }
}));

//Este se usa cuando se agrega un producto, esta información sale por default y luego se edita.
productRouter.post('/', isAuth, isSellerOrAdmin, expressAsyncHandler(async(req,res) =>{
    const product = new Product({
        name: 'sample name ' + Date.now(),
        seller: req.user._id,
        image: '/images/p1.jpg',
        price: 0,
        category: 'Sample category',
        brand: 'Sample brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'Sample description',
    });
    const createdProduct = await product.save();
    res.send({message: 'Product created', product: createdProduct});
}));

//Actulizar un producto
productRouter.put("/:id", isAuth, isSellerOrAdmin, expressAsyncHandler(async(req, res) =>{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product){
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.brand = req.body.brand;
        product.category = req.body.category;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        const updatedProduct = await product.save();
        res.send({message: 'Product Updated', data: updatedProduct});
    }else{
        res.status(404).send({ message: 'Product not found'  });
    }
}));

//Borrar un producto
productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req,res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        const deleteProduct = await product.remove();
        res.send({message: 'Deleted Product', product: deleteProduct});
    }else{
        res.status(404).send({message: 'Product Not Found'});
    }
}));

//Agregar un review
productRouter.post('/:id/reviews', isAuth, expressAsyncHandler(async(req,res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        const review = {
            name: req.body.name,
            rating: Number(req.body.rating),
            comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((a,c) => c.rating + a, 0) / product.reviews.length;
        const productUpdated = await product.save();
        res.send({message: 'Review Saved Successfuly', data: productUpdated.reviews[productUpdated.reviews.length-1]});
    }else{
        res.status(404).send({message: 'Product Not Found'});
    }
}));

export default productRouter;