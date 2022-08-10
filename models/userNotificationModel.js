const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userNotificationSchema = new mongoose.Schema({
    notification_id:{
        type:ObjectId,
        ref:"Notification",
        required:true
    },
    user_id:{
        type:ObjectId,
        ref:"User",
        requried:true
    },
    status:{
        type:String,
        default:"unread",
        required:true
    },
    created_on:{
        type:Date,
        default:Date.now,
        required:true
    }
})

mongoose.model('UserNotification',userNotificationSchema);