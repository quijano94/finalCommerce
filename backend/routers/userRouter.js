import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth } from '../util.js';

const userRouter = express.Router();

userRouter.get('/top-sellers', expressAsyncHandler(async(req, res) =>{
    const topSellers = await User.find({ isSeller: true}).sort({'seller.rating':-1}).limit(3);
    res.send(topSellers);
}))

userRouter.get('/seed', expressAsyncHandler(async(req, res) =>{
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({createdUsers});
}));

userRouter.post('/signin', expressAsyncHandler(async(req,res) =>{
    const user = await User.findOne({email: req.body.email});
    if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isSeller: user.isSeller,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
            return;
        }
    }
    res.status(401).send({message: 'Invalid email or password'});
}));

userRouter.post('/register', expressAsyncHandler(async(req,res) =>{
    const user = new User({ 
        name: req.body.name, 
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    const createdUser = await user.save();
    res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isSeller: createdUser.isSeller,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser)
    });
}));

userRouter.get('/:id', expressAsyncHandler(async(req,res) =>{
    const user = await User.findById(req.params.id);
    if(user){
        res.send(user);
    }else{
        res.status(404).send({message: 'User not found'});
    }
}));

//Actualizacion de la pestaña perfil
userRouter.put('/profile', isAuth, expressAsyncHandler(async(req,res) =>{
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(user.isSeller){
            user.seller.name = req.body.sellerName || user.seller.name;
            user.seller.logo = req.body.sellerLogo || user.seller.logo;
            user.seller.description = req.body.sellerDescription || user.seller.description;
        }
        if(req.body.password){
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isSeller: updatedUser.isSeller,
            token: generateToken(updatedUser),
        });
    }
}));

userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async(req,res) =>{
    const users = await User.find({});
    res.send(users);
}));

userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req,res) =>{
    const user = await User.findById(req.params.id);
    if(user){
        if(user.email === 'angel.q.nolasco@gmail.com'){
            res.status(404).send({message: 'Can Not Delete Super Admin User'})
            return;
        }
        const deleteUser = await user.remove();
        res.send({message: 'User Deleted', user: deleteUser});
    }else{
        res.status(404).send({message: 'User Not Found'});
    }
}));

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        //Parche debido al que el check en el editar perfil no jala bien, y el false no se cambia.
        user.isSeller = (req.body.isSeller ? 'true': 'false') || (user.isSeller ? 'true': 'false');
        user.isAdmin = (req.body.isAdmin ? 'true': 'false') || (user.isAdmin ? 'true' : 'false');

        const updatedUser = await user.save();
        res.send({message: 'User Updated', user:updatedUser});
    }else{
        res.status(404).send({message: 'User Not Found'});
    }
}))

export default userRouter;