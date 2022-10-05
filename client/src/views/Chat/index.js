import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import './chat.css';
import ChatMessage from './ChatMessage';
import ContactList from './ContactList';
import Swal from 'sweetalert2';

const Chat = (props) => {

    const {id} = useParams();
    const [chatmate,setChatMate] = useState(id);
    const [updateList,setUpdateList] = useState(false);
    const user = useUser();

    useEffect(()=>{
        if(!user){
            return;
        }
        if(!id){
            return;
        }
        checkRelation();
    },[])

    const checkRelation = () => {
        fetch('/relation/'+id,{
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
                setUpdateList(data.result);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }
        
    return (
        <React.Fragment>
            <div id='chat-room'>
                <ContactList chatmate={chatmate} setChatMate={setChatMate} updateList={updateList} setUpdateList={setUpdateList}/>
                <ChatMessage chatmate={chatmate} setUpdateList={setUpdateList}/>
            </div>
        </React.Fragment>
    )
}


export default Chat;