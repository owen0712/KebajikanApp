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
    console.log("Pass phase1");
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
    CharityEvent.find().then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.get('/charity_event/:id',(req,res)=>{
    Announcement.find({_id:req.params.id}).then(annoucement=>{
        res.json({announcement:annoucement});
    }).catch(err=>{
        res.json({error:err});
    });
})

router.put('./chaaity_event/:id',);

router.delete('./charity_event/:id',);

module.exports = router;