// src/contexts/UserFormContext.js
import React, { createContext, useContext, useState } from 'react';

const UserFormContext = createContext();

export const useUserForm = () => useContext(UserFormContext);

export const UserFormProvider = ({ children }) => {
    const [profile, setProfile] = useState({});
    const [preferences, setPreferences] = useState({});

    return (
        <UserFormContext.Provider value={{ profile, setProfile, preferences, setPreferences }}>
            {children}
        </UserFormContext.Provider>
    );
};
