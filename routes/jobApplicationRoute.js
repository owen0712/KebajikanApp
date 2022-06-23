const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const JobApplication = mongoose.model('JobApplication');

router.post('/job_application/:id',(req,res)=>{
    console.log("jobApplication:",req.body);
    //62acb99f3e617b651832c980
    const {name,email,identity_no,course,document} = req.body;
    if(!name||!email||!identity_no||!course||!document){
        return res.json({error:'please fill all fields'});
    }
    const newPartTimeJobApplication = new JobApplication({
        job_id:req.params.id,
        name,
        email,
        identity_no,
        course,
        status:"Pending",
        //temporary testing
        created_by:"62acb9307821dc5fe5e123cf",
        document
    });
    newPartTimeJobApplication.save().then(createdPartTimeJobApplication=>{
        console.log("Response",res)
        res.json({message:'New Job Application successfully created'});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.get('/job_application',(req,res)=>{
    JobApplication.find()
    .select("-document")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.get('/job_application/:id',(req,res)=>{
    JobApplication.find({"created_by":req.params.id})
    .select("-document")
    .populate("job_id","title")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.get('/job_application/view/:id',(req,res)=>{
    JobApplication.find({"_id":req.params.id})
    .populate("job_id")
    .then(event=>{
        res.json({event:event[0]});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.put('/job_application/:id',(req,res)=>{
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

router.delete('/job_application/:id',(req,res)=>{
    JobApplication.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;