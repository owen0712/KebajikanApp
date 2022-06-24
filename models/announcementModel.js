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
        type:Object,
        required:true
    },
    created_on:{
        type:Date,
        default:Date.now,
        required:true
    },
    created_by:{
        type:ObjectId,
        ref:"User",
        required:true
    }
})

mongoose.model('Announcement',announcementSchema);