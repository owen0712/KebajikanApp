const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const announcementSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        requried:true
    },
    attachment:{
            
    },
    createdOn:{
        type:Date,
        default:Date.now,
        required:true
    },
    createdBy:{
        type:ObjectId,
        ref:"User",
        required:true
    }
})

mongoose.model('Announcement',announcementSchema);