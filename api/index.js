const express=require('express');
const cors=require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const jwt=require('jsonwebtoken');
const CookieParser=require('cookie-parser');
const bcrypt=require('bcryptjs')
const User=require('./models/User.js')
const Place=require('./models/Place.js')
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
    if(link){
    const newName='photo'+Date.now()+'.jpg';
    await imageDownloader.image({
        url:link,
        dest: __dirname+'/uploads/'+newName,
    })

      .catch((err) => console.error(err));
    res.json(newName);}
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
app.post('/places',(req,res)=>{
    const {token}=req.cookies;
    const{title,address,photos:addedPhotos, description,perks
    ,extraInfo,checkIn,checkOut,maxGuests}=req.body;
    jwt.verify(token, jwtSecret,{},async(err,userData)=>{
        if(err)throw err;
       const placeDoc= await Place.create({
            owner:userData.id,
            title,address,photos:addedPhotos, 
            description,perks
    ,extraInfo,
    checkIn,checkOut,maxGuests
            
        })
        res.json(placeDoc);
      
    })
})
app.get('/places',(req,res)=>{
    const{token}=req.cookies;
    jwt.verify(token, jwtSecret,{},async(err,userData)=>{
        const{id}=userData;
        res.json(await Place.find({owner:id}))
    })

})
app.get('/places/:id',async(req,res)=>{
    const {id}=req.params;
    res.json(await Place.findById(id));
})
app.put('/places',async(req,res)=>{
    const{token}=req.cookies;
    const{id,title,address,addedPhotos, description,perks
        ,extraInfo,checkIn,checkOut,maxGuests}=req.body;
    
    jwt.verify(token, jwtSecret,{},async(err,userData)=>{
        const placeDoc=await Place.findById(id);
        if(userData.id===placeDoc.owner.toString()){
            placeDoc.set({
                
                title,address,photos:addedPhotos, 
                description,perks
        ,extraInfo,
        checkIn,checkOut,maxGuests
                
            })
           await placeDoc.save();
            res.json('ok');
        }
    })  
})
app.listen(4000);