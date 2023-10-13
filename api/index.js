const express=require('express');
const cors=require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')
const User=require('./models/User.js')
const app=express();
const bcryptSalt=bcrypt.genSaltSync(10);
const jwtSecret='sjshji2200knkanwkdjjfkgrjsfdgjfdfresjrkfjsjsgjsaghfksdhkfghkdfhgkjdffjkretyyksjh'
app.use(express.json());

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
                res.cookie('token', token).json("Correct Password");
            });
           
        }else{
            res.status(422).json("Incorrect Password!")
        }
    }else{
        res.json('User Not found');
    }
})
app.listen(4000);