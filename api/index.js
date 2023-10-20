const express=require('express');
const cors=require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const jwt=require('jsonwebtoken');
const CookieParser=require('cookie-parser');
const bcrypt=require('bcryptjs')
const User=require('./models/User.js')
const multer=require('multer');
const app=express();
const bcryptSalt=bcrypt.genSaltSync(10);
const fs=require('fs');
const jwtSecret='sjshji2200knkanwkdjjfkgrjsfdgjfdfresjrkfjsjsgjsaghfksdhkfghkdfhgkjdffjkretyyksjh'
const imageDownloader=require('image-downloader');
app.use(express.json());
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(CookieParser());
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173',
}))
mongoose.connect(process.env.MONGO_URL);

app.get('/test',(req,res)=>{
    res.json('test ok');
})
app.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;
   try{ const userDoc=await User.create({
        name,
        email,
        password:bcrypt.hashSync(password,bcryptSalt),
    })
    res.json(userDoc);
}catch(e){
    res.status(422).json(e);
}
})
app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const Userdoc=await User.findOne({email});
    if(Userdoc){
        const passOk=bcrypt.compareSync(password,Userdoc.password);
        if(passOk){
            jwt.sign({email:Userdoc.email,id:Userdoc._id},jwtSecret,{},(err,token)=>{
                if(err)throw err;
                res.cookie('token', token).json(Userdoc);
            });
           
        }else{
            res.status(422).json("Incorrect Password!")
        }
    }else{
        res.json('User Not found');
    }
})
app.get('/profile',(req,res)=>{
    const {token}=req.cookies;
    if(token){
        jwt.verify(token, jwtSecret,{},async(err,userData)=>{
            if(err)throw err;
            const {name,email,_id}=await User.findById(userData.id);
            res.json({name,email,_id});
        })
    }else{
        res.json(null);
    }
})
app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
})
console.log({__dirname});
app.post('/upload-by-link',async(req,res)=>{
    const {link}=req.body;
    const newName='photo'+Date.now()+'.jpg';
    await imageDownloader.image({
        url:link,
        dest: __dirname+'/uploads/'+newName,
    })
    res.json(newName);
})
const photosMiddleware=multer({dest:'uploads/'})
app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles=[];
    for(let i=0;i<req.files.length;i++){
        const{path,originalname}=req.files[i];
        const parts=originalname.split('.');
        const ext=parts[parts.length-1];
        const newPath=path+ '.' +ext;
        fs.renameSync(path,newPath);
        
        uploadedFiles.push(newPath.replace('uploads\\',''));
    }

    res.json(uploadedFiles);
})
app.listen(4000);