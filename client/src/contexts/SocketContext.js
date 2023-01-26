import React, { useContext, useEffect, useState } from 'react';
import io from "socket.io-client";
import { useUser } from './UserContext';

const SocketContext = React.createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ( {children} ) => {

    // const [port,setPort] = useState("5000");

    const socket = io(``,{
        autoconnect: true,
        reconnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        withCredentials: true,
        forceNew: true,
        reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
        timeout: 10000, //before connect_error and connect_timeout are emitted.
        transports: ['websocket']
    })

    const user = useUser();

    // const getPortNumber = () => {
    //     fetch('/port',{
    //       method:'get',
    //       headers:{
    //           'Content-Type':'application/json'
    //       }
    //     }).then(res=>res.json()).then(data=>{
    //         if(data.error){
    //             console.log(data.error);
    //         }
    //         else{
    //             setPort(data.port);
    //         }
    //     }).catch(err=>{
    //         console.log(err);
    //     })
    // }

    useEffect(()=>{
        if(!user){
            return;
        }
        if(!socket){
            return;
        }
        socket.auth = { username:user.id };
    })

    // useEffect(()=>{
    //     getPortNumber();
    // },[])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}