const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

router.post('/signup',(req,res)=>{
    const {name,email,birthdate,phone_number,password} = req.body;
    if(!name||!email||!birthdate||!phone_number||!password){
        return res.status(422).json({error:'please add all fields'});
    }
    User.findOne({email:email}).then(savedUser=>{
        if(savedUser){
            return res.status(422).json({error:'user already exist'});
        }
        // bcrypt.hash(password,12).then(hashedpassword=>{
        //     const user = new User({
        //         firstname,
        //         lastname,
        //         email,
        //         dob,
        //         contact,
        //         college,
        //         password:hashedpassword,
        //         userType:'User'
        //     })
            
        //     user.save().then(user=>{
        //         res.json({message:'saved successfully'});
        //     }).catch(err=>{
        //         res.json({error:err});
        //     })
        // })
    }).catch(err=>{
        res.json({error:err});
    })
})

router.post('/signin',(req,res)=>{
    const {email, password} = req.body;
    if(!email||!password){
        return res.status(422).json({error:'please add email or password'});
    }
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:'Invalid email or password'});
        }
        // bcrypt.compare(password,savedUser.password).then(isMatch=>{
        //     if(isMatch){
        //         const{_id,firstname,lastname,email,college,contact,dob,userType}=savedUser
        //         if(userType==='User'){
        //             res.json({message:'successfully signed in',user:{_id,firstname,lastname,email,college,contact,dob}});
        //         }
        //         else{
        //             res.json({message:'successfully signed in',user:{_id,firstname,lastname,email,college,contact,dob,userType}});
        //         }
        //     }
        //     else{
        //         return res.status(422).json({error:'Invalid email or password'});
        //     }
        // })
    }).catch(err=>{
        res.json({error:err});
    })
})

module.exports=router;