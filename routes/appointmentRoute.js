const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Appointment = mongoose.model("Appointment");
const Donation = mongoose.model("Donation");
const jwt=require("jsonwebtoken")
const {JWT_SECRET}=require('../config/keys');

// @route   POST /appointment/:id
// @desc    Create New Appointment
// @access  Private
router.post('/appointment/:id',(req,res)=>{
    const {date,time,location,name,email,phone_number,user_id} = req.body;
    if(!date||!time||!location||!name||!email||!phone_number||!user_id){
        return res.json({error:'Please fill all fields'});
    }

    const newAppointment = new Appointment({
        charity_event_id:req.params.id,
        date,
        time,
        location,
        name,
        email,
        phone_number,
        donor_id:user_id
    });
    newAppointment.save().then(createdAppointment=>{
        const newDonation = new Donation({
            name,
            email,
            phone_number,
            charity_event_id:req.params.id,
            category:"Item",
            description:"-",
            donor_id:user_id,
            status:"Pending",
            evidence:"",
            appointment_id:createdAppointment._id
        })
        newDonation.save().then(createdDonation=>{
            res.json({message:'New appointment successfully created'});
        })
    }).catch(err=>{
          res.json({error:err});
    });
});

// @route   GET /apppointment
// @desc    Retrieve All Apppointment
// @access  Private
router.get('/appointment',(req,res)=>{
    Appointment.find()
    .sort('-created_on')
    .then(appointments=>{
        res.json({appointments:appointments});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /apppointment/:id
// @desc    Retrieve Specific Apppointment
// @access  Private
router.get('/appointment/:id',(req,res)=>{
    Appointment.find({_id:req.params.id})
    .populate("charity_event_id")
    .then(appointment=>{
        res.json({appointment:appointment[0]});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   PUT /apppointment/status/:id
// @desc    Update Status For Specific Apppointment
// @access  Private
router.put('/appointment/:id',(req,res)=>{
    const {date,time,location,name,email,phone_number} = req.body;
    if(!date||!time||!location||!name||!email||!phone_number){
        return res.json({error:'Please fill all fields'});
    }
    Appointment.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

// @route   PUT /apppointment/status/:id
// @desc    Update Status For Specific Apppointment
// @access  Private
router.put('/appointment/status/:id',(req,res)=>{
    const {status} = req.body;
    if(!status){
        return res.json({error:'Invalid status'});
    }
    Appointment.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

module.exports = router;