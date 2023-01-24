const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Donation = mongoose.model("Donation");
const CharityEvent = mongoose.model("CharityEvent");
const {STRIPE_SECRET, DOMAIN}=require('../config/keys');
const stripe = require('stripe')(STRIPE_SECRET);
const requiredLogin = require('../middlewares/requiredLogin');
const {generateReceipt} = require('../utils/pdfgenerator');
const {sendReceiptEmail} = require('../utils/nodemailer');

// @route   POST /donation/money/:id
// @desc    Create New Money Donation
// @access  Private
router.post('/donation/money/:id',requiredLogin,(req,res)=>{
    const {name, email, phone_number, amount} = req.body;
    if(!name||!email||!phone_number||!amount){
        return res.json({error:'Please fill all fields'});
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
    .then(async(donation)=>{
        if(donation?.receipt){
            return res.json({status:"OK"});
        }
        await generateReceipt(donation);
        setTimeout(()=>{
            Donation.findOne({_id:req.params.id})
            .then(async(donation)=>{
                const emailContent = {
                    destinationEmail:donation.email,
                    subject:"Thank You For Your Donation",
                    content:"Thank you for your donation. This is the computer-generated receipt for your donation",
                    attachment:donation.receipt
                }
                await sendReceiptEmail(emailContent);
            }).catch(err=>{
                res.json({error:err});
            });
        }, 5000);
        if(donation.category=="Money"){
            CharityEvent.findOneAndUpdate({_id:donation.charity_event_id},{$inc : {'current_amount' : donation.amount}},{new:false},(err,result)=>{
                if(err){
                    return res.json({error:err})
                }
                res.json({status:"OK"});
    
            })
        }
        else{
            res.json({status:"OK"});
        }
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /receipt/:id
// @desc    Retrieve Receipt
// @access  Private
router.get('/receipt/:id',requiredLogin,(req,res)=>{
    Donation.findOne({_id:req.params.id})
    .then(donation=>{
        res.json({receipt:donation.receipt});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /donation
// @desc    Retrieve All Donation
// @access  Private
router.get('/donation',requiredLogin,(req,res)=>{
    Donation.find({$or: [{"status" : {"$ne": "Pending" }}, {"category" : {"$ne": "Money" }}]})
    .select("-receipt")
    .sort('-created_on')
    .populate("charity_event_id","title")
    .populate("donor_id","name")
    .populate("appointment_id")
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

// @route   PUT /donation/status/verified/:id
// @desc    Update Donation Status With Evidence
// @access  Private
router.put('/donation/status/verified/:id',requiredLogin,(req,res)=>{
    const {status, evidence} = req.body;
    if(!status){
        return res.json({error:'Invalid status'});
    }
    if(!evidence){
        return res.json({error:'Please upload the evidence'});
    }
    Donation.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            console.log(err)
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