const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const charityEventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    donation_start_date:{
        type:Date,
        required:true
    },
    donation_end_date:{
        type:Date,
        required:true
    },
    preregister_start_date:{
        type:Date,
        required:true
    },
    preregister_end_date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    current_amount:{
        type:Number,
        default:0,
        required:true
    },
    purpose:{
        type:String,
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
    recipients:{
        type:[ObjectId],
        ref:"CharityApplication"
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
    verified_by:{
        type:ObjectId,
        ref:"User"
    },
    verified_on:{
        type:Date
    },
    photo:{
        type:Object,
        required:true
    },
    document:{
        type:Object,
        required:true
    }
})

mongoose.model('CharityEvent',charityEventSchema);