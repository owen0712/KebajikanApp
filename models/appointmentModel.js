const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const appointmentSchema = new mongoose.Schema({
    charity_event_id:{
        type:ObjectId,
        ref:"CharityEvent",
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    //TO-DO: check how the time will be saved
    time:{
        type:String,
        required:true
    },
    location:{
        type:String,
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
    phone_number:{
        type:String,
        required:true
    },
    donor_id:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    created_on:{
        type:Date,
        default:Date.now,
        required:true
    }
})

mongoose.model('Appointment',appointmentSchema);