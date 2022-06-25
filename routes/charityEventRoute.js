const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CharityEvent = mongoose.model('CharityEvent');

router.post('/charity_event',(req,res)=>{
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

router.get('/charity_event/approved',(req,res)=>{
    CharityEvent.find({ "status" : { "$in": ["Not Started", "In Progress", "Preregistration","Closed"] }})
    .select("-document")
    .sort('-created_on')
    .then(events=>{
        res.json({events:events});
    }).catch(err=>{
        res.json({error:err});
    });
})

router.get('/charity_event/document/:id',(req,res)=>{
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

router.get('/charity_event/organizer/:id',(req,res)=>{
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

router.get('/charity_event/name/:id',(req,res)=>{
    CharityEvent.find({_id:req.params.id}).then(event=>{
        res.json({name:event[0].title});
    }).catch(err=>{
        res.json({error:err});
    });
})

router.put('/charity_event/:id',(req,res)=>{
    const {title,purpose,description,location,amount,preregister_start_date,preregister_end_date,donation_start_date,donation_end_date,photo,document,receipeint} = req.body;
    if(!title||!purpose||!description||!location||!amount||!preregister_start_date||!preregister_end_date||!donation_start_date||!donation_end_date||!photo||!document){
        return res.json({error:'please fill all fields'});
    }
    CharityEvent.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

router.put('/charity_event/status/:id',(req,res)=>{
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

router.delete('/charity_event/:id',(req,res)=>{
    CharityEvent.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;