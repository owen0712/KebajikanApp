const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PartTimeJob = mongoose.model('PartTimeJob');
const requiredLogin = require('../middlewares/requiredLogin');

// @route   POST /part_time_job
// @desc    Create New Part-time Job
// @access  Private
router.post('/part_time_job',requiredLogin,(req,res)=>{
    //62acb99f3e617b651832c980
    const {title,required_student,description,location,allowance,closed_date,photo,user_id,role} = req.body;
    if(!title||!required_student||!description||!location||!allowance||!closed_date||!photo||!user_id||!role){
        return res.json({error:'please fill all fields'});
    }
    const status = (role==2)?"Available":"Pending";
    const successMessage = 'New part-time job successfully '+((role==2)?"created!":"proposed!");
    const newPartTimeJob = new PartTimeJob({
        title,
        required_student,
        allocated_student:[],
        description,
        location,
        allowance,
        closed_date,
        photo,
        status,
        //temporary testing
        organizer_id:user_id,
        created_by:user_id
    });
    newPartTimeJob.save().then(createdPartTimeJob=>{
        res.json({message:successMessage});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /part_time_job
// @desc    Retrive Part-time Job 
// @access  Private
router.get('/part_time_job',requiredLogin,(req,res)=>{
    PartTimeJob.find({status:{ "$in": ["Closed", "Available"] }})
    .select("-photo")
    .populate("organizer_id","name")
    .sort("-created_on")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /part_time_job/organizer/:id
// @desc    Retrieve User Proposed Part-time Job
// @access  Private
router.get('/part_time_job/organizer/:id',requiredLogin,(req,res)=>{
    PartTimeJob.find({organizer_id:req.params.id})
    .select("-photo")
    .populate("organizer_id","name")
    .sort("-created_on")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /part_time_job/available
// @desc    Retrieve Available Part-time Job
// @access  Public
router.get('/part_time_job/available',(req,res)=>{
    PartTimeJob.find({status:"Available"})
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /part_time_job/:id
// @desc    Retrieve Specific Part-time Job
// @access  Public
router.get('/part_time_job/:id',(req,res)=>{
    PartTimeJob.find({_id:req.params.id})
    .populate("organizer_id","name")
    .then(event=>{
        res.json({event:event[0]});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   PUT /part_time_job/:id
// @desc    Update Part-time Job
// @access  Private
router.put('/part_time_job/:id',requiredLogin,(req,res)=>{
    const {title,required_student,description,location,allowance,closed_date,photo} = req.body;
    if(!title||!required_student||!description||!location||!allowance||!closed_date||!photo){
        return res.json({error:'please fill all fields'});
    }
    PartTimeJob.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

// @route   DELETE /part_time_job/:id
// @desc    Delete Part-time Job
// @access  Private
router.delete('/part_time_job/:id',requiredLogin,(req,res)=>{
    PartTimeJob.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;