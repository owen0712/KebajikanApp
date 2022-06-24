const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Announcement = mongoose.model('Announcement');

router.get('/announcement',(req,res)=>{
    Announcement.find()
    .sort("-created_on")
    .then(announcements=>{
        res.json({announcements:announcements});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.get('/announcement/list',(req,res)=>{
    Announcement.find()
    .select('-attachment')
    .sort("-created_on")
    .then(announcements=>{
        res.json({announcements:announcements});
    }).catch(err=>{
        res.json({error:err});
    });
});


router.get('/announcement/:id',(req,res)=>{
    Announcement.find({_id:req.params.id})
    .then(announcement=>{
        res.json({announcement:announcement[0]});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.post('/announcement',(req,res)=>{
    const {title,description,attachment,user_id} = req.body;
    if(!title||!description||!attachment||!user_id){
        return res.json({error:'please fill all fields'});
    }
    const newAnnouncement = new Announcement({
        title,
        description,
        attachment,
        created_by:user_id
    });
    newAnnouncement.save().then(createdAnnouncement=>{
        res.json({message:'New announcement successfully created'});
    }).catch(err=>{
        res.json({error:err});
    });
});

router.put('/announcement/:id',(req,res)=>{
    const {title,description,attachment} = req.body;
    if(!title||!description){
        return res.json({error:'please fill all fields'});
    }
    Announcement.findByIdAndUpdate(req.params.id,req.body,{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        res.json({message:"Successfully updated"})
    })
});

router.delete('/announcement/:id',(req,res)=>{
    
    Announcement.deleteOne({_id:req.params.id}).then(result=>{
        res.json({message:"Successfully Deleted"});
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;