const jwt=require('jsonwebtoken');
const {JWT_SECRET_REFRESH,JWT_SECRET_ACCESS}=require('../config/keys');
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
    jwt.verify(token,JWT_SECRET_REFRESH,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"Invalid refresh token"});
        }
        const {_id}=payload;
        User.findById(_id)
        .select('-password')
        .then(userdata=>{
            jwt.verify(userdata.access_token,JWT_SECRET_ACCESS,(err,payload)=>{
                if(err){
                    return res.status(401).json({error:"Invalid access token"});
                }
                req.user=userdata;
                next();
            })
        })
    })
}