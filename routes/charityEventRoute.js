const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CharityEvent = mongoose.model('CharityEvent');
const requiredLogin = require('../middlewares/requiredLogin');

// @route   POST /charity_event
// @desc    Create New Charity Event
// @access  Private
router.post('/charity_event',requiredLogin,(req,res)=>{
    const {title,purpose,description,location,amount,preregister_start_date,preregister_end_date,donation_start_date,donation_end_date,photo,document,user_id,role} = req.body;
    if(!title||!purpose||!description||!location||!amount||!preregister_start_date||!preregister_end_date||!donation_start_date||!donation_end_date||!photo||!document||!user_id||!role){
        return res.json({error:'please fill all fields'});
    }

    const status = role==2?"Not Started":"Pending";

    const newCharityEvent = new CharityEvent({
        title,
        purpose,
        description,
        location,
        amount,
        preregister_start_date,
        preregister_end_date,
        donation_start_date,
        donation_end_date,
        status:status,
        organizer_id:user_id,
        created_by:user_id,
        photo,
        document
    });
    newCharityEvent.save().then(createdCharityEvent=>{
        res.json({message:'New event successfully created'});
    }).catch(err=>{
          res.json({error:err});
    });
});

// @route   POST /charity_event/approved
// @desc    Retrieve Approved Charity Event
// @access  Private
router.get('/charity_event/approved',requiredLogin,(req,res)=>{
    CharityEvent.find({ "status" : { "$in": ["Not Started", "In Progress", "Preregistration","Closed"] }})
    .select("-document")
    .populate("organizer_id","-_id name")
    .sort('-created_on')
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /charity_event/view
// @desc    Retrieve Available Charity Event
// @access  Public
router.get('/charity_event/view',(req,res)=>{
    CharityEvent.find({ "status" : { "$in": ["In Progress", "Preregistration"] }})
    .select("-document")
    .sort('-created_on')
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /charity_event/document/:id
// @desc    Retrieve Charity Event's Document
// @access  Private
router.get('/charity_event/document/:id',requiredLogin,(req,res)=>{
    CharityEvent.find({_id:req.params.id})
    .then(event=>{
        res.json({document:event[0].document});
    }).catch(err=>{
        res.json({error:err});
    });
})

router.get('/charity_event',(req,res)=>{
    CharityEvent.find({"status" : { "$in": ["In Progress", "Preregistration","Closed"]}})
    .select("-document")
    .select("-photo")
    .sort("-created_on")
    .populate("organizer_id","-_id name")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /charity_event/organizer/:id
// @desc    Retrieve User Proposed Charity Event
// @access  Private
router.get('/charity_event/organizer/:id',requiredLogin,(req,res)=>{
    CharityEvent.find({organizer_id:req.params.id})
    .select("-photo")
    .select("-document")
    .populate("organizer_id","name")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /charity_event/:id
// @desc    Retrieve Specific Charity Event
// @access  Public
router.get('/charity_event/:id',(req,res)=>{
    CharityEvent.find({_id:req.params.id})
    .populate("organizer_id","name")
    .then(event=>{
        event[0].document.content="";
        res.json({event:event[0]});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   GET /charity_event/name/:id
// @desc    Retrieve Charity Event Name
// @access  Public
router.get('/charity_event/name/:id',(req,res)=>{
    CharityEvent.find({_id:req.params.id}).then(event=>{
        res.json({name:event[0].title});
    }).catch(err=>{
        res.json({error:err});
    });
})

// @route   PUT /charity_event/:id
// @desc    Update Charity Event
// @access  Private
router.put('/charity_event/:id',requiredLogin,(req,res)=>{
    const {title,purpose,description,location,amount,preregister_start_date,preregister_end_date,donation_start_date,donation_end_date,photo,document,receipeint} = req.body;
    if(!title||!purpose||!description||!location||!amount||!preregister_start_date||!preregister_end_date||!donation_start_date||!donation_end_date||!photo||!document){
        return res.json({error:'please fill all fields'});
    }
    const date = new Date();
    if(date>new Date(donation_end_date)){
        req.body.status = "Closed";
    }
    else if(date>new Date(preregister_end_date)){
        req.body.status = "In Progress";
    }
    else if(date>new Date(preregister_start_date)){
        req.body.status = "Preregistration";
    }
    else {
        req.body.status = req.user.role=="User"?"Pending":"Not Started";
    }

    CharityEvent.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

// @route   PUT /charity_event/status/:id
// @desc    Update Charity Event Status
// @access  Private
router.put('/charity_event/status/:id',requiredLogin,(req,res)=>{
    const {status} = req.body;
    if(!status){
        return res.json({error:'Invalid status'});
    }
    CharityEvent.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

// @route   DELETE /charity_event/:id
// @desc    Delete Charity Event
// @access  Private
router.delete('/charity_event/:id',requiredLogin,(req,res)=>{
    CharityEvent.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;