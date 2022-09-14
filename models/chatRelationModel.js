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
    }
})

mongoose.model('ChatRelation',chatRelationSchema);