const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const jobApplicationSchema = new mongoose.Schema({
    job_id:{
        type:ObjectId,
        ref:"PartTimeJob",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    identity_no:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:"Pending"
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
    },
    verified_by:{
        type:ObjectId,
        ref:"User"
    },
    verified_on:{
        type:Date
    },
    document:{
        type:Object,
        required:true
    },
    
})

mongoose.model('JobApplication',jobApplicationSchema);