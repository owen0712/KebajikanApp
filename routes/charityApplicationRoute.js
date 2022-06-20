const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CharityApplication = mongoose.model('CharityApplication');

router.post('/charity_application/:id',(req,res)=>{
    console.log(req.body);
    //62acb9307821dc5fe5e123cf
    const {name,phone_number,identity_no,email,ic_no,marital_status,current_address,permanent_address,program,department,year_of_study,semester,father_occ,mother_occ,father_income,mother_income,total_income,no_sibling,no_dependent,document,photo} = req.body;
    if(!name||!phone_number||!identity_no||!email||!ic_no||!marital_status||!current_address||!permanent_address||!program||!department||!year_of_study||!semester||!father_occ||!mother_occ||!photo||!document){
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
        //temporary testing
        created_by:"62acb9307821dc5fe5e123cf",
        photo,
        document
    });
    newCharityEventApplication.save().then(createdCharityEventApplication=>{
        res.json({message:'New aplication successfully created'});
    }).catch(err=>{
          res.json({error:err});
    });
});

router.get('/charity_application',);

router.get('/charity_application/:id',);

router.put('/charity_application/:id',);

router.delete('/charity_application/:id',);

module.exports = router;