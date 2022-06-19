const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CharityEvent = mongoose.model('CharityEvent');

router.post('/charity_event',(req,res)=>{
    //62acb99f3e617b651832c980
    const {title,purpose,description,location,amount,preregister_start_date,preregister_end_date,donation_start_date,donation_end_date,photo,document} = req.body;
    if(!title||!purpose||!description||!location||!amount||!preregister_start_date||!preregister_end_date||!donation_start_date||!donation_end_date||!photo||!document){
        return res.json({error:'please fill all fields'});
    }
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
        status:"Pending",
        //temporary testing
        organizer_id:"62acb99f3e617b651832c980",
        created_by:"62acb99f3e617b651832c980",
        photo,
        document
    });
    newCharityEvent.save().then(createdCharityEvent=>{
        res.json({message:'New event successfully created'});
    }).catch(err=>{
          res.json({error:err});
    });
});

router.get('/charity_event',(req,res)=>{
    CharityEvent.find()
    .select("-photo,-document")
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.get('/charity_event/:id',(req,res)=>{
    CharityEvent.find({_id:req.params.id}).then(event=>{
        res.json({event:event});
    }).catch(err=>{
        res.json({error:err});
    });
})

router.put('./charity_event/:id',(req,res)=>{

});

router.delete('./charity_event/:id',(req,res)=>{
    CharityEvent.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;