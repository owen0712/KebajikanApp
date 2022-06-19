const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PartTimeJob = mongoose.model('PartTimeJob');

router.post('/part_time_job',(req,res)=>{
    //62acb99f3e617b651832c980
    const {title,required_student,description,location,allowance,closed_date,photo} = req.body;
    if(!title||!required_student||!description||!location||!allowance||!closed_date||!photo){
        return res.json({error:'please fill all fields'});
    }
    const newPartTimeJob = new PartTimeJob({
        title,
        required_student,
        allocated_student:[],
        description,
        location,
        allowance,
        closed_date,
        photo,
        status:"Available",
        //temporary testing
        organizer_id:"62acb99f3e617b651832c980",
        created_by:"62acb99f3e617b651832c980",
        created_on:((new Date()).getDate()),
    });
    newPartTimeJob.save().then(createdPartTimeJob=>{
        res.json({message:'New part-time job successfully created'});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.get('/part_time_job',(req,res)=>{
    PartTimeJob.find()
    .select("-photo")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.get('/part_time_job/:id',(req,res)=>{
    PartTimeJob.find({_id:req.params.id}).then(event=>{
        res.json({event:event});
    }).catch(err=>{
        res.json({error:err});
    });
})

router.put('./part_time_job/:id',(req,res)=>{

});

router.delete('./part_time_job/:id',(req,res)=>{
    PartTimeJob.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;