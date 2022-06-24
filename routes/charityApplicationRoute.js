const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CharityApplication = mongoose.model('CharityApplication');

router.post('/charity_application/:id',(req,res)=>{
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

router.get('/charity_application',);

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

router.get('/charity_application/view/:id',(req,res)=>{
    CharityApplication.find({"_id":req.params.id})
    .populate("event_id","title")
    .then(event=>{
        res.json({event:event[0]});
    }).catch(err=>{
        res.json({error:err});
    });
});

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

router.delete('/charity_application/:id',(req,res)=>{
    CharityApplication.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;