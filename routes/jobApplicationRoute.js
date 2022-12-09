const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const JobApplication = mongoose.model('JobApplication');
const requiredLogin = require('../middlewares/requiredLogin');

// @route   POST /job_application/:id
// @desc    Create New Part-time Job Application
// @access  Private
router.post('/job_application/:id',requiredLogin,(req,res)=>{
    console.log("jobApplication:",req.body);
    //62acb99f3e617b651832c980
    const {name,email,identity_no,course,document,user_id,role} = req.body;
    if(!name||!email||!identity_no||!course||!document||!user_id||!role){
        return res.json({error:'please fill all fields'});
    }
    JobApplication.find({"created_by":user_id, "job_id":req.params.id, "status":"Pending"})
    .select("-document")
    .then(events=>{
        if(events.length>0){
            res.json({error:"You had appplied this job before."});
            isAppliedBefore=true;
        }else{
            const newPartTimeJobApplication = new JobApplication({
                job_id:req.params.id,
                name,
                email,
                identity_no,
                course,
                status:"Pending",
                //temporary testing
                created_by:user_id,
                document
            });
            
            newPartTimeJobApplication.save().then(createdPartTimeJobApplication=>{
                console.log("Response",res)
                res.json({message:'New Job Application successfully created'});
            }).catch(err=>{
                res.json({error:err});
            });
        }
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /job_application
// @desc    Retrieve All Users' Job Applications
// @access  Private
router.get('/job_application',requiredLogin,(req,res)=>{
    JobApplication.find()
    .select("-document")
    .populate("job_id","title")
    .populate("created_by","name")
    .sort("-created_on")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});


// @route   GET /job_application/:id
// @desc    Retrieve User's Job Applications
// @access  Private
router.get('/job_application/:id',requiredLogin,(req,res)=>{
    JobApplication.find({"created_by":req.params.id})
    .select("-document")
    .populate("job_id","title")
    .sort("-created_on")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /job_application/view/:id
// @desc    Retrieve Specific User's Job Application
// @access  Private
router.get('/job_application/view/:id',requiredLogin,(req,res)=>{
    JobApplication.find({"_id":req.params.id})
    .populate("job_id")
    .then(event=>{
        res.json({event:event[0]});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   PUT /job_application/:id
// @desc    Update User's Job Application
// @access  Private
router.put('/job_application/:id',requiredLogin,(req,res)=>{
    const {name,email,identity_no,course,document} = req.body;
    if(!name||!email||!identity_no||!course||!document){
        return res.json({error:'please fill all fields'});
    }
    JobApplication.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

// @route   PUT /job_application/status/:id
// @desc    Update User Application Status
// @access  Private
router.put('/job_application/status/:id',requiredLogin,(req,res)=>{
    const {status, verified_by, verified_on} = req.body;
    if(!status || !verified_by || !verified_on){
        return res.json({error:'Error occur. Application Status failed to update'});
    }
    JobApplication.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});


// @route   DELETE /job_application/:id
// @desc    Delete User's Job Application
// @access  Private
router.delete('/job_application/:id',requiredLogin,(req,res)=>{
    JobApplication.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully withdraw"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;