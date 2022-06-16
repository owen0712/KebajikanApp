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
        type:Double,
        required:true
    },
    purpose:{
        type:String,
        required:true
    },
    description:{
        type:String
        //not compulsary
    },
    location:{
        type:String,
        required:true
    },
    receipient:{
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
        type:String,
        required:true
    },
    cover:{
        
    }
})

mongoose.model('CharityEvent',charityEventSchema);