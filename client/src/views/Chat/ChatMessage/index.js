import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './chat_message.css';
import { useUser } from '../../../contexts/UserContext';
import Swal from 'sweetalert2';
import { useSocket } from '../../../contexts/SocketContext';

const ChatMessage = (props) => {

    const navigate = useNavigate();
    const user = useUser();
    const [message,setMessage] = useState("");
    const [chatrecord,setChatRecord] = useState([]);
    const [chatmate,setChatMate] = useState(null);
    const selectedChatMate = props.chatmate;
    const socket = useSocket();

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            if(selectedChatMate){
                fetchChatMateData();
                fetchChatRecordData();
            }
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    useEffect(()=>{
        socket.on('receive_message',(data)=>{
            setChatRecord(prev=>[...prev,data]);
        })
    },[socket])

    useEffect(()=>{
        if(selectedChatMate!=null){
            setMessage("");
            fetchChatMateData();
            fetchChatRecordData();
        }
    },[selectedChatMate])
    
    const fetchChatMateData = () => {
        if(!selectedChatMate){
            return;
        }
        fetch('/chatmate/'+selectedChatMate,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            }
            else{
                setChatMate(data.chatmate);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const fetchChatRecordData = () => {
        if(!selectedChatMate){
            return;
        }
        fetch('/chatrecord/'+selectedChatMate,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            }
            else{
                setChatRecord(data.records);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const handleMessageOnChange = (event) => {
        setMessage(event.target.value);
    }

    const handleKeyUp = (event) => {
        if(event.key === 'Enter'){
            if(!message){
                return;
            }
            socket.emit('send_message',{from:user.id,to:selectedChatMate,message});
            setMessage("");
            fetchChatRecordData();
        }
    }
        
    return (
        <React.Fragment>
            <div className='chat-window'>
                <div className='chat-contact'>
                    {
                        chatmate&&<>
                            <img src={chatmate.profile_pic}/>
                            <span>{chatmate.name}</span>
                        </>
                    }    
                </div>
                <div className='chat-message'>
                    {chatmate&&chatrecord.map(record=>{
                        return <div key={record._id} className={`message ${record.sender==user.id?'sender':'recipient'}`}>
                            <p>{record.content}</p>
                            <small>{`${record.date.slice(0,10)} ${record.date.slice(11,16)}`}</small>
                        </div>
                    })}
                </div>
                <div className='chat-input'>
                    <input value={message} type='text' placeholder='Type a message' onChange={handleMessageOnChange} onKeyUp={handleKeyUp} disabled={!chatmate}/>
                </div>
            </div>
        </React.Fragment>
    )
}


export default ChatMessage;