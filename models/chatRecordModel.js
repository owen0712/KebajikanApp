const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const chatRecordSchema = new mongoose.Schema({
    sender:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    recipient:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:"Unread"
    }
})

mongoose.model('ChatRecord',chatRecordSchema);