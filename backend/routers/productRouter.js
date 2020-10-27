import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import {isAdmin, isAuth} from '../util.js';

const productRouter = express();

productRouter.get('/', expressAsyncHandler(async(req,res)=>{
    const products = await Product.find({});
    res.send(products);
}));

productRouter.get('/seed', expressAsyncHandler(async(req,res) =>{
    // await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({createdProducts});
}));

productRouter.get('/:id', expressAsyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(product){
        res.send(product);
    }else{
        res.status(500).send({message: 'Product not found.'});
    }
}));

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async(req,res) =>{
    const product = new Product({
        name: 'sample name ' + Date.now(),
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

productRouter.put("/:id", isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
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

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req,res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        const deleteProduct = await product.remove();
        res.send({message: 'Deleted Product', product: deleteProduct});
    }else{
        res.status(404).send({message: 'Product Not Found'});
    }
}));

export default productRouter;