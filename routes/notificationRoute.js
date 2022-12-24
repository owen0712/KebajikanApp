const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = mongoose.model('Notification');
const UserNotification = mongoose.model('UserNotification');
const requiredLogin = require('../middlewares/requiredLogin');

// @route   POST /notification
// @desc    Push New Notification
// @access  Private
router.post('/notification',requiredLogin,(req,res)=>{
    const {title,description,recipients,user_id} = req.body;
    if(!title||!description||!recipients||!user_id){
        return res.json({error:'please fill all fields'});
    }
    const newNotification = new Notification({
        title,
        description,
        receiver:recipients,
        created_by:user_id
    });
    newNotification.save().then(createdNotification=>{
        recipients.forEach(recipient_id=>{
            const newUserNotification = new UserNotification({
                notification_id:createdNotification._id,
                user_id:recipient_id
            })
            newUserNotification.save().catch(err=>{
                res.json({error:err})
            });;
        })
        res.json({message:'New notification successfully created'});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /notification
// @desc    Retrieve Notification
// @access  Private
router.get('/notification',requiredLogin,(req,res)=>{
    Notification.find()
    .sort("-created_on")
    .then(notifications=>{
        res.json({notifications:notifications});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /notification/:id
// @desc    Retrieve Specific Notification
// @access  Private
router.get('/notification/:id',requiredLogin,(req,res)=>{
    Notification.find({_id:req.params.id})
    .populate('receiver','name')
    .then(notification=>{
        res.json({notification:notification[0 ]});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   GET /notification/unread/:id
// @desc    Retrieve User Notification
// @access  Private
router.get('/notification/unread/:id',requiredLogin,(req,res)=>{
    UserNotification.find({user_id:req.params.id})
    .populate('notification_id',['title','description','created_on'])
    .sort('-created_on')
    .then(notifications=>{
        res.json({userNotifications:notifications});
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   PUT /notification/read/:id
// @desc    Update User Viewed Notification
// @access  Private
router.put('/notification/read/:id',requiredLogin,(req,res)=>{
    UserNotification.find({user_id:req.params.id,status:"unread"})
    .then(notifications=>{
        notifications.forEach((notification)=>{
            UserNotification.findByIdAndUpdate(notification._id,{status:"read"},{new:false},(err,result)=>{
                if(err){
                    console.log(err);
                }
                // console.log(result);
            })
        })
    }).catch(err=>{
        res.json({error:err});
    });
});

// @route   PUT /notification/:id
// @desc    Update Notification
// @access  Private
router.put('/notification/:id',requiredLogin,(req,res)=>{
    const {title,description,recipients} = req.body;
    if(!title||!description){
        return res.json({error:'Please fill all fields'});
    }
    recipients.forEach((recipient,index)=>{
        recipients[index]=recipient._id
    })
    Notification.findByIdAndUpdate(req.params.id,{title,description,receiver:recipients},{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        //delete unselected user notifications
        UserNotification.find({notification_id:req.params.id})
        .then(existingNotifications=>{
            existingNotifications.forEach(existingUserNotification=>{
                if(!recipients.includes(existingUserNotification.user_id.toString())){
                    UserNotification.deleteOne({ _id: existingUserNotification._id })
                    .then(result=>{
                        console.log(result)
                    }).catch(err=>{
                        res.json({error:err})
                    })
                }
            })
        })
        //push notification to user after update the recipient
        recipients.forEach(recipient_id=>{
            UserNotification.find({notification_id:req.params.id,user_id:recipient_id})
            .then(createdNotification=>{
                if(createdNotification.length==0){
                    const newUserNotification = new UserNotification({
                        notification_id:req.params.id,
                        user_id:recipient_id
                    })
                    newUserNotification.save().catch(err=>{
                        res.json({error:err})
                    });
                }
            }).catch(err=>{
                res.json({error:err});
            });
        })
        res.json({message:"Successfully updated"})
    })
});

// @route   DELETE /notification/:id
// @desc    Delete Notification
// @access  Private
router.delete('/notification/:id',requiredLogin,(req,res)=>{
    Notification.deleteOne({_id:req.params.id}).then(result=>{
        UserNotification.deleteMany({notification_id:req.params.id})
        .then(result=>{    
            res.json({message:"Successfully Deleted"});
        })
    }).catch(err=>{
        res.json({error:err})
    })
});

module.exports = router;