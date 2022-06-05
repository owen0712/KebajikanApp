const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
// const bcrypt = require('bcryptjs');

router.put('/user/:id',(req,res)=>{
    const {name,email,birthdate,phone_number}=req.body;
    if(!name||!email||!birthdate||!phone_number){
        return res.status(422).json({error:'please make sure all fields are filled'});
    }
    User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:false},(err,result)=>{
        if(err){
            return res.status(422).json({error:"Update failed"});
        }
        const {_id,userType} = result;
        if(userType==='User'){
            res.json({message:'Update Successfully',user:{_id,name,email,birthdate,phone_number}});
        }
        else{
            res.json({message:'Update Successfully',user:{_id,name,email,birthdate,phone_number}});
        }
    })
})

// router.put('/password/:id',(req,res)=>{
//     const {originalpassword,newpassword}=req.body;
//     if(!originalpassword||!newpassword){
//         return res.status(422).json({error:'please make sure all fields are filled'});
//     }
//     User.findOne({_id:req.params.id}).then(savedUser=>{
//         if(!savedUser){
//             return res.status(422).json({error:'Cannot found user'});
//         }
//         bcrypt.compare(originalpassword,savedUser.password).then(isMatch=>{
//             if(isMatch){
//                 bcrypt.hash(newpassword,12).then(hashedpassword=>{
//                     User.findByIdAndUpdate(req.params.id,{$set:{password:hashedpassword}},{new:false},(err,result)=>{
//                         if(err){
//                             return res.status(422).json({error:"Update failed"});
//                         }
//                         res.json({message:'Update Successfully'});
//                     })
//                 })   
//             }
//             else{
//                 return res.status(422).json({error:'Wrong original password'});
//             }
//         })
//     }).catch(err=>{
//         res.json({error:err});
//     })
// })

module.exports=router