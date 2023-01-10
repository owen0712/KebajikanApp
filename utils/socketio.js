const socketIO = require('socket.io');
const { DOMAIN } = require('../config/keys');
const mongoose = require('mongoose');
require('../models/chatRecordModel');
require('../models/chatRelationModel');
const ChatRecord = mongoose.model('ChatRecord');
const ChatRelation = mongoose.model('ChatRelation');

const socketio = (server) => {
    const io = socketIO(server, {
        cors: {
          origin: `${DOMAIN}`,
          methods: ["GET", "POST"],
          credentials: true
        },
        upgrade: false,
        transports: ['websocket']
    })
    
    const users = {};
    
    io.on("connection", (socket)=> {
        const username = socket.handshake.auth.username;
        if(!username){
            return;
        }
        users[username] = socket.id;

        socket.on('send_message', ({from,to,message}, callback)=>{

            ChatRelation.findOne({user_id:to,chatmate_id:from}).then(savedRelation=>{
                if(savedRelation){
                    //Save the record when no relation is needed to be created
                    const newChatRecord = new ChatRecord({
                        content:message,
                        sender:from,
                        recipient:to
                    })
            
                    newChatRecord.save().then(savedChatRecord=>{
                        if(users[to]){
                            socket.to(users[to]).emit('receive_message',savedChatRecord)
                        }
                        callback({latest_chat_record:savedChatRecord._id});
                    })
                    return ;
                }

                const newChatRelation = new ChatRelation({
                    user_id:to,
                    chatmate_id:from
                });
                newChatRelation.save().then(createdRelation=>{
                    //Save the record after a new relation is created
                    const newChatRecord = new ChatRecord({
                        content:message,
                        sender:from,
                        recipient:to
                    })
            
                    newChatRecord.save().then(savedChatRecord=>{
                        if(users[to]){
                            socket.to(users[to]).emit('receive_message',savedChatRecord)
                        }
                        callback({latest_chat_record:savedChatRecord._id});
                    })
                    console.log('New relation successfully created');
                }).catch(err=>{
                    console.log("error: ", err);
                });
            }).catch(err=>{
                console.log("error: ", err);
            });
            
        })
    })
    
    
}

module.exports = socketio;