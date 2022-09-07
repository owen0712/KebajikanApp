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
    status:{
        type:String,
        default:"Not Active",
        required:true
    },
    identity_no:{
        type:String
    },
    role:{
        type:String,
        default:'User'
    },
    profile_pic:{
        type:Object
    },
    refresh_token:{
        type:String
    },
    access_token:{
        type:String
    }
})

mongoose.model('User',userSchema);