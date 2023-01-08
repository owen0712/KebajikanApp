const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CharityApplication = mongoose.model('CharityApplication');
const requiredLogin = require('../middlewares/requiredLogin');

// @route   POST /charity_application/:id
// @desc    Create New Charity Event Application
// @access  Private
router.post('/charity_application/:id',requiredLogin,(req,res)=>{
    const {name,phone_number,identity_no,email,ic_no,marital_status,current_address,permanent_address,program,department,year_of_study,semester,father_occ,mother_occ,father_income,mother_income,total_income,no_sibling,no_dependent,document,photo,user_id,role} = req.body;
    if(!name||!phone_number||!identity_no||!email||!ic_no||!marital_status||!current_address||!permanent_address||!program||!department||!year_of_study||!semester||!father_occ||!mother_occ||!photo||!document||!user_id||!role){
        return res.json({error:'please fill all fields'});
    }
    const newCharityEventApplication = new CharityApplication({
        event_id:req.params.id,
        name,
        phone_number,
        identity_no,
        email,
        ic_no,
        marital_status,
        current_address,
        permanent_address,
        program,
        department,
        year_of_study,
        semester,
        father_occ,
        mother_occ,
        father_income,
        mother_income,
        total_income,
        no_sibling,
        no_dependent,document,
        photo,
        created_by:user_id,
        photo,
        document
    });
    newCharityEventApplication.save().then(createdCharityEventApplication=>{
        res.json({message:'New application successfully created'});
    }).catch(err=>{
          res.json({error:err});
    });
});

// @route   GET /charity_application/:id
// @desc    Retrieve User Application
// @access  Private
router.get('/charity_application/:id',(req,res)=>{
    CharityApplication.find({"created_by":req.params.id})
    .select("-photo")
    .select("-document")
    .populate("event_id","title")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /charity_application/view/:id
// @desc    Retrieve Specific User Application
// @access  Private
router.get('/charity_application/view/:id',(req,res)=>{
    CharityApplication.find({"_id":req.params.id})
    .populate("event_id","title")
    .then(event=>{
        res.json({event:event[0]});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /charity_application/recipient/:id
// @desc    Retrieve Charity Application Receipt
// @access  Private
router.get('/charity_application/receipt/:id',(req,res)=>{
    CharityApplication.findOne({"_id":req.params.id})
    .then(application=>{
        res.json({receipt:application.receipt});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /charity_application/approved/:id
// @desc    Retrieve Charity Application Receipt
// @access  Private
router.get('/charity_application/approved/:id',(req,res)=>{
    CharityApplication.find({"created_by":req.params.id,"status":{ "$in": ["Approved", "Paid"] }})
    .populate("event_id","title")
    .then(applications=>{
        res.json({applications});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   PUT /charity_application/:id
// @desc    Update User Application
// @access  Private
router.put('/charity_application/:id',(req,res)=>{
    const {name,phone_number,identity_no,email,ic_no,marital_status,current_address,permanent_address,program,department,year_of_study,semester,father_occ,mother_occ,father_income,mother_income,total_income,no_sibling,no_dependent,document,photo} = req.body;
    if(!name||!phone_number||!identity_no||!email||!ic_no||!marital_status||!current_address||!permanent_address||!program||!department||!year_of_study||!semester||!father_occ||!mother_occ||!photo||!document){
        return res.json({error:'please fill all fields'});
    }
    CharityApplication.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

// @route   PUT /charity_application/status/:id
// @desc    Update User Application Status
// @access  Private
router.put('/charity_application/status/:id',requiredLogin,(req,res)=>{
    const {status, verified_by, verified_on} = req.body;
    if(!status || !verified_by || !verified_on){
        return res.json({error:'Error occur. Application Status failed to update'});
    }
    CharityApplication.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

// @route   PUT /charity_application/recipient/:id
// @desc    Update User Application
// @access  Private
router.put('/charity_application/recipient/:id',(req,res)=>{
    const {name,status,bank_acc,bank,details} = req.body;
    if(!name||!status||!bank_acc||!bank||!details){
        return res.json({error:'please fill all fields'});
    }
    CharityApplication.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            console.log(err)
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

// @route   DELETE /charity_application/:id
// @desc    Delete User Application
// @access  Private
router.delete('/charity_application/:id',(req,res)=>{
    CharityApplication.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

// @route   GET /charity_application
// @desc    Retrieve All Users' Charity Applications
// @access  Private
router.get('/charity_application',requiredLogin,(req,res)=>{
    CharityApplication.find()
    .select("-document")
    .populate("event_id","title")
    .populate("created_by","name")
    .sort("-created_on")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /charity_application/organizer/:id
// @desc    Retrieve Users' Charity Applications for the specific organizer who created the event
// @access  Private
router.get('/charity_application/organizer/:id',requiredLogin,(req,res)=>{
    CharityApplication.find()
    .select("-document")
    .populate("event_id",["title","created_by"])
    .populate("created_by","name")
    .sort("-created_on")
    .then(events=>{
        res.json({events:events.filter((e)=>{return e.event_id.created_by==req.params.id})});
    }).catch(err=>{
        res.json({error:err});
    });
});

module.exports = router;