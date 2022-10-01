const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const chatRelationSchema = new mongoose.Schema({
    user_id:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    chatmate_id:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    latest_chat_record:{
        type:ObjectId,
        ref:"ChatRecord"
    },
    modified_on:{
        type:Date,
        required:true,
        default:Date.now
    }
})

mongoose.model('ChatRelation',chatRelationSchema);