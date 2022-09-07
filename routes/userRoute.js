const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const requiredLogin = require('../middlewares/requiredLogin');

router.get('/user',(req,res)=>{
    User.find({},{_id:1,name:1})
    .sort('-role')
    .sort('name')
    .then(users=>{
        res.json({users:users});
    }).catch(err=>{
        res.json({error:err});
    });
})

router.get('/user/:id',requiredLogin,(req,res)=>{
    const {profile_pic,name,email,phone_number,identity_no,birthdate,status} = req.user;
    if(!req.user){
        return res.json({error:"Invalid user"});
    }
    return res.json({user:{profile_pic,name,email,phone_number,identity_no,birthdate,status}});
})

router.put('/user/:id',(req,res)=>{
    const {name,email,birthdate,phone_number,profile_pic}=req.body;
    if(!name||!email||!birthdate||!phone_number||!profile_pic){
        return res.status(422).json({error:'please make sure all fields are filled'});
    }
    User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:false},(err,result)=>{
        if(err){
            return res.status(422).json({error:"Update failed"});
        }
        res.json({message:'Update Successfully'});
    })
})

router.put('/password/:id',(req,res)=>{
    const {current_password,new_password}=req.body;
    if(!current_password||!new_password){
        return res.json({error:'Please make sure all fields are filled'});
    }
    User.findOne({_id:req.params.id}).then(savedUser=>{
        if(!savedUser){
            return res.json({error:'User is not existed'});
        }
        bcrypt.compare(current_password,savedUser.password).then(isMatch=>{
            if(isMatch){
                bcrypt.hash(new_password,12).then(hashedpassword=>{
                    User.findByIdAndUpdate(req.params.id,{$set:{password:hashedpassword}},{new:false},(err,result)=>{
                        if(err){
                            return res.json({error:"Update failed"});
                        }
                        res.json({message:'Password successfully updated'});
                    })
                })   
            }
            else{
                return res.json({error:'Wrong original password'});
            }
        })
    }).catch(err=>{
        res.json({error:err});
    })
})

// @route   PUT /user/status/:id
// @desc    Update Status For Specific User
// @access  Private
router.put('/user/status/:id',(req,res)=>{
    const {status} = req.body;
    if(!status){
        return res.json({error:'Invalid status'});
    }
    User.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

module.exports=router