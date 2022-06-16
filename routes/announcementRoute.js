const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Announcement = mongoose.model('Announcement');

router.get('/announcement',(req,res)=>{
    Announcement.find().then(annoucements=>{
        res.json({announcements:annoucements});
    }).catch(err=>{
        res.json({error:err});
    })
})

router.post('/announcement/:id',(req,res)=>{
    const {title,description,attachment} = req.body;
    if(!title||!description){
        return res.json({error:'please add all fields'});
    }
    const newAnnouncement = new Announcement({
        title,
        description,
        attachment,
        createdBy:req.params.id
    });
    newAnnouncement.save().then(createdAnnouncement=>{
        res.json({message:'New event successfully created'});
    }).catch(err=>{
        res.json({error:err});
    })
});

router.put('/announcement/:id',(req,res)=>{
    const {title,description,attachment} = req.body;
    if(!title||!description){
        return res.json({error:'please add all fields'});
    }
    newAnnouncement.save({_id:req.params.id}).then(savedAnnouncement=>{
        res.json({message:'Announcement successfully updated'});
    }).catch(err=>{
        res.json({error:err});
    })
});

router.delete('/announcement/:id',(req,res)=>{

});

modules.exports = router;