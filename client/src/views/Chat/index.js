import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './chat.css';
import { useUser } from '../../contexts/UserContext';
import ChatMessage from './ChatMessage';
import ContactList from './ContactList';
import { SocketProvider } from '../../contexts/SocketContext';

const Chat = (props) => {

    const navigate = useNavigate();
    const user = useUser();
    const {id} = useParams();
    const [chatmate,setChatMate] = useState(id);
        
    return (
        <React.Fragment>
            <div id='chat-room'>
                <ContactList chatmate={chatmate} setChatMate={setChatMate}/>
                <ChatMessage chatmate={chatmate}/>
            </div>
        </React.Fragment>
    )
}


export default Chat;