const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const partTimeJobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    closed_date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    required_student:{
        type:Number,
        required:true
    },
    allowance:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    allocated_student:{
        type:[ObjectId],
        ref:"User"
    },
    organizer_id:{
        type:ObjectId,
        ref:"User",
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
    },
    photo:{
        type:Object,
        required:true
    }
})

mongoose.model('PartTimeJob',partTimeJobSchema);