const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Donation = mongoose.model("Donation");
const {STRIPE_SECRET, DOMAIN}=require('../config/keys');
const stripe = require('stripe')(STRIPE_SECRET);
const requiredLogin = require('../middlewares/requiredLogin');
const {generateReceipt} = require('../utils/pdfgenerator');
const path = require('path');

// @route   POST /donation/money/:id
// @desc    Create New Money Donation
// @access  Private
router.post('/donation/money/:id',requiredLogin,(req,res)=>{
    const {name, email, phone_number, amount} = req.body;
    if(!name,!email,!phone_number,!amount){
        return res.json({error:'please fill all fields'});
    }

    const newDonation = new Donation({
        name,
        email,
        phone_number,
        charity_event_id:req.params.id,
        category:"Money",
        description:"-",
        donor_id:req.user._id,
        status:"Pending",
        evidence:"",
        amount
    })
    
    newDonation.save().then(createdDonation=>{
        stripe.checkout.sessions.create({
            payment_method_types: ['card','fpx'],
            line_items: [
              {
                "price_data":{
                    "currency":"myr",
                    "unit_amount":amount*100,
                    "product_data":{
                        "name":"Money Donation",
                        "description":"Money Donation",
                    }
                },
                "quantity": 1,
              },
            ],
            mode: 'payment',
            customer_email:email,
            success_url: `${DOMAIN}/charity_event/donate_money/success/${createdDonation._id}`,
            cancel_url: `${DOMAIN}/charity_event/donate_money/failed/${createdDonation._id}`,
        }).then(session=>{
            res.json({url:session.url});
        }).catch(err=>{
            console.log(err);
        })
    })
});

// @route   POST /receipt/:id
// @desc    Generate Receipt
// @access  Private
router.post('/receipt/:id',requiredLogin,(req,res)=>{
    Donation.findOne({_id:req.params.id})
    .populate('donor_id')
    .populate('charity_event_id')
    .then(donation=>{
        generateReceipt(donation);
        res.json({status:"OK"})
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /receipt/:id
// @desc    Retrieve Receipt
// @access  Private
router.get('/receipt/:id',requiredLogin,(req,res)=>{
    res.download(`${path.resolve(__dirname, '..')}/receipt/${req.params.id}.pdf`,(err)=>{
        if(err){
            console.log(err)
        }
    });
})

// @route   GET /donation
// @desc    Retrieve All Donation
// @access  Private
router.get('/donation',requiredLogin,(req,res)=>{
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
router.get('/donation/user/:id',requiredLogin,(req,res)=>{
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
router.get('/donation/:id',requiredLogin,(req,res)=>{
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
router.put('/donation/status/:id',requiredLogin,(req,res)=>{
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
router.put('/donation/item/:id',requiredLogin,(req,res)=>{
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