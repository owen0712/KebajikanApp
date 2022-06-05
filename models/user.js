const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    birthdate:{
        type:Date,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'User'
    },
    resetToken:String,
    expireToken:String
})

mongoose.model('User',userSchema);