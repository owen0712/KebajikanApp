import React, { useContext, useEffect } from 'react';
import io from "socket.io-client";
import { useUser } from './UserContext';

const SocketContext = React.createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ( {children} ) => {

    const socket = io.connect('http://localhost:5000');

    const user = useUser();

    useEffect(()=>{
        if(user){
            socket.auth = { username:user.id };
        }
    })

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}