const jwt=require('jsonwebtoken');
const {JWT_SECRET_ACCESS}=require('../config/keys');
const mongoose=require('mongoose');
const User=mongoose.model('User');

module.exports=(req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"});
    }
    const token=authorization.replace("Bearer","");
    if(!token){
        return res.status(401).json({error:"You must be logged in"});
    }
    jwt.verify(token,JWT_SECRET_ACCESS,(err,payload)=>{
        if(err){
            console.log(err)
            return res.status(401).json({error:"You must be logged in"});
        }
        const {_id}=payload;
        User.findById(_id).then(userdata=>{
            req.user=userdata;
            next();;
        })
    })
}