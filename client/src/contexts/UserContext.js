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

    const updateUser = (newUser) => {
        setUser(newUser);
        if(newUser==null){
            sessionStorage.removeItem("refresh_token");
        }
        sessionStorage.setItem("refresh_token",newUser.refresh_token);
    }

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={updateUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
}