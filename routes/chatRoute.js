const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatRelation = mongoose.model('ChatRelation');
const ChatRecord = mongoose.model('ChatRecord');
const User = mongoose.model('User');
const requiredLogin = require('../middlewares/requiredLogin');

// @route   POST /chat
// @desc    Create New Chat Relation
// @access  Private
router.post('/chat',requiredLogin,(req,res)=>{
    const {user_id,chatmate_id} = req.body;
    if(!user_id||!chatmate_id){
        return res.json({error:'Please fill all fields'});
    }
    if(user_id==chatmate_id){
        return res.json({error:'Both user cannot be same'});
    }
    ChatRelation.findOne({user_id,chatmate_id}).then(savedRelation=>{
        if(savedRelation){
            return res.json({error:"Relation existed"})
        }
        const newChatRelation = new ChatRelation({
            user_id,
            chatmate_id
        });
        newChatRelation.save().then(createdRelation=>{
            res.json({message:'New relation successfully created'});
        }).catch(err=>{
            res.json({error:err});
        });
    }).catch(err=>{
        res.json({error:err});
    });
    
});

// @route   GET /chat/:id
// @desc    Retrieve User Contact List
// @access  Private
router.get('/chat',requiredLogin,(req,res)=>{
    ChatRelation.find({user_id:req.user._id})
    .sort('-modified_on')
    .populate('chatmate_id','profile_pic name')
    .populate('latest_chat_record','content')
    .then(relations=>{
        res.json({relations:relations});
    }).catch(err=>{
        console.log(err)
        res.json({error:err});
    });
})

// @route   GET /chatmate/:id
// @desc    Retrieve Chatmate Details
// @access  Private
router.get('/chatmate/:id',requiredLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .then(user=>{
        const {name,profile_pic} = user;
        return res.json({chatmate:{name,profile_pic}});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /chatrecord/:id
// @desc    Retrieve Chatmate Record
// @access  Private
router.get('/chatrecord/:id',requiredLogin,(req,res)=>{
    ChatRecord.find({$or:[{$and:[{sender:req.params.id},{recipient:req.user._id}]},{$and:[{sender:req.user._id},{recipient:req.params.id}]}]})
    .sort('date')
    .then(records=>{
        return res.json({records});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   PUT /chatrelation/:id
// @desc    Update Chat Relation
// @access  Private
router.put('/chatrelation/:id',requiredLogin,(req,res)=>{
    ChatRelation.findOneAndUpdate({user_id:req.user._id,chatmate_id:req.params.id},req.body,{new:false},(err,result)=>{
        if(err){
            console.log(err)
            return res.json({error:err})
        }
        ChatRelation.findOneAndUpdate({user_id:req.params.id,chatmate_id:req.user._id},req.body,{new:false},(err,result)=>{
            if(err){
                return res.json({error:err})
            }
            
            res.json({message:"Successfully updated"})
        })
    })
})

module.exports = router;