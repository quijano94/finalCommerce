import multer from 'multer';
import express from 'express';
import { isAuth } from '../util.js';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/');
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}.jpg`);
    },
});

const upload = multer({storage});

uploadRouter.post('/', isAuth, upload.single('image'), (req,res) =>{
    res.send(`/${req.file.path}`); 
});

aws.config.update({
    accessKeyId: (process.env.accessKeyId || 'AKIAIFRHSNVCBC4C3DLA'),
    secretAccessKey: (process.env.secretAccessKey || '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'),
});

const s3 = new aws.S3();
const storageS3 = multerS3({
    s3,
    bucket: 'commerce-bucket',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req,file,cb){
        cb(null, file.originalname);
    },
});

const uploadS3 = multer({storage: storageS3});
uploadRouter.post('/s3', uploadS3.single('image'), (req,res) =>{
    res.send(req.file.location);
})

export default uploadRouter;