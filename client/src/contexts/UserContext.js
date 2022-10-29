import React, {useContext, useEffect, useState} from 'react';

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

export const useUser = () => {
    return useContext(UserContext);
}

export const useUserUpdate = () => {
    return useContext(UserUpdateContext);
}

export const UserProvider = ( {children} ) => {
    const [user,setUser] = useState(null);
    const [isFetching,setIsFetching] = useState(true);

    const updateUser = (newUser) => {
        setUser(newUser);
        if(newUser==null){
            sessionStorage.removeItem("refresh_token");
        }
        sessionStorage.setItem("refresh_token",newUser.refresh_token);
        setIsFetching(false);
    }

    useEffect(()=>{
        const refresh_token=sessionStorage.getItem("refresh_token");
        if(user==null&&refresh_token){
            refreshUserData();
        }
        if(user&&refresh_token){
            refreshToken();
        }
        setIsFetching(false);
    },[user])
    
    const refreshUserData = () => {
        const refresh_token=sessionStorage.getItem("refresh_token");
        fetch('/refresh/token',{
          method:'get',
          headers:{
              'Content-Type':'application/json',
              'Authorization':'Bearer'+refresh_token
          }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                updateUser(data.user);
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    
    const refreshToken = () => {
        const refresh_token=sessionStorage.getItem("refresh_token");
        setTimeout(() => {
          fetch('/refresh/token',{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+refresh_token
            }
          }).then(res=>res.json()).then(data=>{
              if(data.error){
                  console.log(data.error);
              }
              else{
                updateUser(data.user);
                refreshToken();
              }
          }).catch(err=>{
              console.log(err);
          })
        }, 300000);
    }

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={updateUser}>
                {!isFetching&&children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
}