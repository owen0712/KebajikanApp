import React, { useContext, useEffect, useState } from 'react';
import io from "socket.io-client";
import { useUser } from './UserContext';

const SocketContext = React.createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ( {children} ) => {

    const [port,setPort] = useState("5000");

    const socket = io.connect(`http://localhost:${port}`);

    const user = useUser();

    const getPortNumber = () => {
        fetch('/port',{
          method:'get',
          headers:{
              'Content-Type':'application/json'
          }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setPort(data.port);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        if(!user){
            return;
        }
        if(!socket){
            return;
        }
        socket.auth = { username:user.id };
    })

    useEffect(()=>{
        getPortNumber();
    },[])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}