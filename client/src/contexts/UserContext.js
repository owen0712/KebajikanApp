import React, {useContext, useState} from 'react';

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
    }

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={updateUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
}