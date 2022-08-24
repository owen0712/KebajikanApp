const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Donation = mongoose.model("Donation");
const jwt=require("jsonwebtoken")
const {JWT_SECRET, STRIPE_SECRET}=require('../config/keys');
const stripe = require('stripe')(STRIPE_SECRET);

// @route   POST /donation/money/:id
// @desc    Create New Money Donation
// @access  Private
router.post('/donation/money/:id',(req,res)=>{
    // const {date,time,location,name,email,phone_number,user_id} = req.body;
    // console.log(req.body)
    // if(!date||!time||!location||!name||!email||!phone_number||!user_id){
    //     return res.json({error:'please fill all fields'});
    // }

    // const newAppointment = new Appointment({
    //     charity_event_id:req.params.id,
    //     date,
    //     time,
    //     location,
    //     name,
    //     email,
    //     phone_number,
    //     donor_id:user_id
    // });
    // newAppointment.save().then(createdAppointment=>{
    //     res.json({message:'New appointment successfully created'});
    // }).catch(err=>{
    //       res.json({error:err});
    // });
});

// @route   GET /donation
// @desc    Retrieve All Donation
// @access  Private
router.get('/donation',(req,res)=>{
    Donation.find()
    .sort('-created_on')
    .then(donations=>{
        res.json({donations:donations});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /donation/user/:id
// @desc    Retrieve Spcific User's Donation
// @access  Private
router.get('/donation/user/:id',(req,res)=>{
    Donation.find({donor_id:req.params.id})
    .populate("charity_event_id","title")
    .sort('-created_on')
    .then(donations=>{
        res.json({donations:donations});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /donation/:id
// @desc    Retrieve Specific Donation
// @access  Private
router.get('/donation/:id',(req,res)=>{
    Donation.find({_id:req.params.id})
    .populate("charity_event_id")
    .populate("appointment_id")
    .then(donation=>{
        res.json({donation:donation[0]});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   PUT /donation/status/:id
// @desc    Update Donation Status
// @access  Private
router.put('/donation/status/:id',(req,res)=>{
    const {status} = req.body;
    if(!status){
        return res.json({error:'Invalid status'});
    }
    Donation.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
})

// @route   PUT /donation/item/:id
// @desc    Update Item Donation Details
// @access  Private
router.put('/donation/item/:id',(req,res)=>{
    const {name,email,phone_number,items} = req.body;
    if(!name||!email||!phone_number||!items){
        return res.json({error:'Please fill all fields'});
    }
    const updatedContent = {
        name,
        email,
        phone_number,
        items,
        status:"Not Verified"
    }
    Donation.findByIdAndUpdate(req.params.id,updatedContent,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
})

module.exports = router;