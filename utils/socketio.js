const { Server } = require('socket.io');
const { DOMAIN } = require('../config/keys');
const mongoose = require('mongoose');
require('../models/chatRecordModel');
const ChatRecord = mongoose.model('ChatRecord');

const socketio = (server) => {
    const io = new Server(server, {
        cors:{
            origin: `${DOMAIN}`
        }
    })
    
    const users = {};
    
    io.on("connection", (socket)=> {
        const username = socket.handshake.auth.username;
        if(!username){
            return;
        }
        users[username] = socket.id;

        socket.on('send_message', ({from,to,message})=>{

            console.log(message)

            const newChatRecord = new ChatRecord({
                content:message,
                sender:from,
                recipient:to
            })
    
            newChatRecord.save().then(savedChatRecord=>{
                if(users[to]){
                    socket.to(users[to]).emit('receive_message',savedChatRecord)
                }
            })
        })
    })
    
    
}

module.exports = socketio;